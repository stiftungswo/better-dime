<?php

namespace App\Models\Employee;

use App\Models\Project\Project;
use App\Models\Project\ProjectEffort;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class WorkPeriod extends Model
{
    use SoftDeletes, BlameableTrait;

    /* please mind the following things in the database
    1. pensum is in integer, e.g. 100 is a 100% pensum
    3. yearly_vacation_budget is an integer value in minutes

    please mind the following things for the additional attributes:

    effort_till_today: calculates all efforts for this work_period until today or if the ending is in the past, until the ending
        it excludes any efforts which are booked on a position with a rate unit which has "is_time" false
        it also excludes any efforts on projects which have "vacation_project" true
        it also excludes any paid public holidays within this range
        in the end, it is a amount of minutes the employee HAS to work in this period

    period_vacation_budget: period can be shorter than a year, or span over multiple years, but vacation budget is set for a year
        this basically calculates the eligible amount of minutes the employee can take holidays

    target_time: basically effort_till_today, but calculates the amount the employee should work from beginning of the period until its end

    vacation_till_today: basically effort_till_today, but it only includes holiday projects
        so you get the effective amount of minutes the employee has taken vacations
    */

    protected $appends = ['overlapping_periods', 'vacation_takeover', 'effective_time', 'effort_till_today', 'period_vacation_budget', 'target_time', 'remaining_vacation_budget'];

    protected $hidden = ['employee'];

    protected $fillable = ['employee_id', 'ending', 'pensum', 'beginning', 'yearly_vacation_budget'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function getTargetTimeAttribute()
    {
        $weekdays = Carbon::parse($this->beginning)->diffInWeekdays(Carbon::parse($this->ending)->addDay());
        $pensum = $this->pensum / 100;
        $targetTimeWithoutHolidays = $weekdays * 8.4 * 60;
        $paidTimeInDateRange = Holiday::paidTimeInDateRange($this->beginning, $this->ending);
        return round($pensum * ($targetTimeWithoutHolidays - $paidTimeInDateRange), 0);
    }

    public function getPeriodVacationBudgetAttribute()
    {
        $workPeriodStart = Carbon::parse($this->beginning);
        $workPeriodEnd = Carbon::parse($this->ending);

        $pensum = $this->pensum / 100;
        $vacationEntitlement = $this->yearly_vacation_budget;

        $startYear = $workPeriodStart->year;
        $endYear = $workPeriodEnd->year;

        $holidayMinutes = 0;

        for ($i = $startYear; $i <= $endYear; $i++) {
            $beginning = Carbon::create($i)->startOfYear();
            $ending = Carbon::create($i)->endOfYear()->startOfDay();
            $daysOfYear = ($beginning->diffInWeekdays($ending) + 1) * 8.4 * 60;

            if ($this->beginning > $beginning) {
                $beginning = $workPeriodStart;
            }

            if ($this->ending < $ending) {
                $ending = $workPeriodEnd;
            }

            $daysInYearPeriod = ($beginning->diffInWeekdays($ending) + 1) * 8.4 * 60;
            $holidayMinutes += ($vacationEntitlement / $daysOfYear) * $daysInYearPeriod;
        }

        $vacationForPensum = $holidayMinutes * $pensum;

        return round($vacationForPensum, 0);
    }

    public function getEffortTillTodayAttribute()
    {
        $beginning = Carbon::parse($this->beginning);

        if ($this->ending < Carbon::now()->startOfDay()) {
            $ending = Carbon::parse($this->ending);
        } elseif (Carbon::now()->startOfDay() < $this->beginning) {
            $ending = Carbon::parse($this->beginning)->subDay();
        } else {
            $ending = Carbon::now()->startOfDay();
        }

        $weekdays = Carbon::parse($this->beginning)->diffInWeekdays(Carbon::parse($ending)->addDay());
        $pensum = $this->pensum / 100;
        $targetTimeWithoutHolidays = $weekdays * 8.4 * 60;
        $paidTimeInDateRange = Holiday::paidTimeInDateRange($this->beginning, $ending);
        $targetTimeUntilToday = round($pensum * ($targetTimeWithoutHolidays - $paidTimeInDateRange), 0);

        return $this->effective_time - $targetTimeUntilToday;
    }

    public function getEffectiveTimeAttribute()
    {
        $beginning = Carbon::parse($this->beginning);
        $ending = Carbon::parse($this->ending);

        return $this->calculateBookedTime($beginning, $ending) + $this->vacation_takeover;
    }

    public function getRemainingVacationBudgetAttribute()
    {
        $beginning = Carbon::parse($this->beginning);
        $ending = Carbon::parse($this->ending);

        return $this->period_vacation_budget - $this->calculateBookedTime($beginning, $ending, true);
    }

    public function getVacationTakeoverAttribute()
    {
        $reference_workperiod = $this->getRelevantWorkPeriod();
        $effective_time = 0;
        $remaining_budget = 0;
        $first_takeover = $this->isFirstPeriod() ? $this->employee->first_vacation_takeover : 0;

        if (!is_null($reference_workperiod)) {
                return $reference_workperiod->remaining_vacation_budget + $reference_workperiod->effort_till_today;
        }

        return $effective_time + $remaining_budget + $first_takeover;
    }

    public function getOverlappingPeriodsAttribute()
    {
        $beginning = Carbon::parse($this->beginning);
        $ending = Carbon::parse($this->ending);

        $wps = WorkPeriod::where([
            ['deleted_at', '=', null],
            ['employee_id', '=', $this->employee->id],
            ['id', '!=', $this->id],
        ])->get();

        foreach ($wps as $wp) {
            $wp_beginning = Carbon::parse($wp->beginning)->endOfDay();
            $wp_end = Carbon::parse($wp->ending)->endOfDay();

            $inside = $wp_beginning < $ending && $wp_end > $beginning;
            $leftOverlap = $wp_beginning < $beginning && $wp_end > $beginning;
            $rightOverlap = $wp_beginning < $ending && $wp_end > $ending;

            if ($inside || $leftOverlap || $rightOverlap) {
                return true;
            }
        }

        return false;
    }

    private function calculateBookedTime(Carbon $beginning, Carbon $ending, $onlyVacations = false)
    {
        if ($beginning > Carbon::now()->startOfDay()) {
            return 0;
        }

        $qb = DB::table('project_efforts')->leftJoin('project_positions', 'project_efforts.position_id', '=', 'project_positions.id')
            ->leftJoin('projects', 'project_positions.project_id', '=', 'projects.id')
            ->leftJoin('rate_units', 'project_positions.rate_unit_id', '=', 'rate_units.id')
            ->where([
                ['project_efforts.deleted_at', '=', null],
                ['project_efforts.date', '>', $beginning->subDay()->endOfDay()],
                ['project_efforts.date', '<', $ending->addDay()->startOfDay()],
                ['project_efforts.employee_id', '=', $this->employee->id],
                ['rate_units.is_time', '=', true]
            ]);

        if ($onlyVacations) {
            $qb = $qb->where('projects.vacation_project', '=', $onlyVacations);
        }

        return round($qb->sum('project_efforts.value'), 0);
    }

    private function getRelevantWorkPeriod()
    {
        $closest_end = Carbon::parse($this->beginning)->subCentury();

        $wps = WorkPeriod::where([
                ['deleted_at', '=', null],
                ['employee_id', '=', $this->employee->id],
                ['ending', '<', $this->beginning],
                ['id', '!=', $this->id],
            ])->get();

        foreach ($wps as $wp) {
            $wp_end = Carbon::parse($wp->ending)->endOfDay();

            if ($wp_end > $closest_end) {
                $closest_end = $wp_end;
            }
        }

        $candidates = array();

        foreach ($wps as $wp) {
            $wp_end = Carbon::parse($wp->ending)->endOfDay();

            if ($wp_end >= $closest_end) {
                array_push($candidates, $wp);
            }
        }

        $furthest_beginning = null;

        foreach ($candidates as $wp) {
            if (is_null($furthest_beginning)) {
                $furthest_beginning = $wp;
            } else {
                $fs_beginning = Carbon::parse($furthest_beginning->beginning)->endOfDay();
                $wp_beginning = Carbon::parse($wp->beginning)->endOfDay();

                if ($wp_beginning < $fs_beginning) {
                    $furthest_beginning = $wp;
                }
            }
        }

        return $furthest_beginning;
    }

    private function isFirstPeriod()
    {
        $wps = WorkPeriod::where([
            ['deleted_at', '=', null],
            ['employee_id', '=', $this->employee->id],
            ['beginning', '<', $this->beginning],
            ['id', '!=', $this->id],
        ])->get();

        $isFirst = count($wps) == 0;

        return $isFirst;
    }
}
