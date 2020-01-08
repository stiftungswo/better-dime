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
    2. vacation_takeover is a float value in minutes
    3. yearly_vacation_budget is an integer value in minutes

    please mind the following things for the additional attributes:

    effort_till_today: calculates all efforts for this work_period until today or if the end is in the past, until the end
        it excludes any efforts which are booked on a position with a rate unit which has "is_time" false
        it also excludes any efforts on projects which have "vacation_project" true
        it also excludes any paid public holidays within this range
        in the end, it is a amount of minutes the employee HAS to work in this period

    period_vacation_budget: period can be shorter than a year, or span over multiple years, but vacation budget is set for a year
        this basically calculates the eligible amount of minutes the employee can take holidays

    target_time: basically effort_till_today, but calculates the amount the employee should work from start of the period until its end

    vacation_till_today: basically effort_till_today, but it only includes holiday projects
        so you get the effective amount of minutes the employee has taken vacations
    */

    protected $appends = ['overlapping_periods', 'vacation_takeover', 'effective_time', 'effort_till_today', 'period_vacation_budget', 'target_time', 'remaining_vacation_budget'];

    protected $hidden = ['employee'];

    protected $fillable = ['employee_id', 'end', 'pensum', 'start', 'yearly_vacation_budget'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function getTargetTimeAttribute()
    {
        $weekdays = Carbon::parse($this->start)->diffInWeekdays(Carbon::parse($this->end)->addDay());
        $pensum = $this->pensum / 100;
        $targetTimeWithoutHolidays = $weekdays * 8.4 * 60;
        $paidTimeInDateRange = Holiday::paidTimeInDateRange($this->start, $this->end);
        return round($pensum * ($targetTimeWithoutHolidays - $paidTimeInDateRange), 0);
    }

    public function getPeriodVacationBudgetAttribute()
    {
        $workPeriodStart = Carbon::parse($this->start);
        $workPeriodEnd = Carbon::parse($this->end);

        $pensum = $this->pensum / 100;
        $vacationEntitlement = $this->yearly_vacation_budget;

        $startYear = $workPeriodStart->year;
        $endYear = $workPeriodEnd->year;

        $holidayMinutes = 0;

        for ($i = $startYear; $i <= $endYear; $i++) {
            $start = Carbon::create($i)->startOfYear();
            $end = Carbon::create($i)->endOfYear()->startOfDay();
            $daysOfYear = ($start->diffInWeekdays($end) + 1) * 8.4 * 60;

            if ($this->start > $start) {
                $start = $workPeriodStart;
            }

            if ($this->end < $end) {
                $end = $workPeriodEnd;
            }

            $daysInYearPeriod = ($start->diffInWeekdays($end) + 1) * 8.4 * 60;
            $holidayMinutes += ($vacationEntitlement / $daysOfYear) * $daysInYearPeriod;
        }

        $vacationForPensum = $holidayMinutes * $pensum;
        $vacationForPensum += $this->vacation_takeover;

        return round($vacationForPensum, 0);
    }

    public function getEffortTillTodayAttribute()
    {
        $start = Carbon::parse($this->start);

        if ($this->end < Carbon::now()->startOfDay()) {
            $end = Carbon::parse($this->end);
        } elseif (Carbon::now()->startOfDay() < $this->start) {
            $end = Carbon::parse($this->start)->subDay();
        } else {
            $end = Carbon::now()->startOfDay();
        }

        $weekdays = Carbon::parse($this->start)->diffInWeekdays(Carbon::parse($end)->addDay());
        $pensum = $this->pensum / 100;
        $targetTimeWithoutHolidays = $weekdays * 8.4 * 60;
        $paidTimeInDateRange = Holiday::paidTimeInDateRange($this->start, $end);
        $targetTimeUntilToday = round($pensum * ($targetTimeWithoutHolidays - $paidTimeInDateRange), 0);

        return $this->calculateBookedTime($start, $end) - $targetTimeUntilToday;
    }

    public function getEffectiveTimeAttribute()
    {
        $start = Carbon::parse($this->start);
        $end = Carbon::parse($this->end);

        return $this->calculateBookedTime($start, $end);
    }

    public function getRemainingVacationBudgetAttribute()
    {
        $start = Carbon::parse($this->start);
        $end = Carbon::parse($this->end);

        return $this->period_vacation_budget - $this->calculateBookedTime($start, $end, true);
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
        $start = Carbon::parse($this->start);
        $end = Carbon::parse($this->end);

        $wps = WorkPeriod::where([
            ['deleted_at', '=', null],
            ['employee_id', '=', $this->employee->id],
            ['id', '!=', $this->id],
        ])->get();

        foreach ($wps as $wp) {
            $wp_start = Carbon::parse($wp->start)->endOfDay();
            $wp_end = Carbon::parse($wp->end)->endOfDay();

            $inside = $wp_start < $end && $wp_end > $start;
            $leftOverlap = $wp_start < $start && $wp_end > $start;
            $rightOverlap = $wp_start < $end && $wp_end > $end;

            if ($inside || $leftOverlap || $rightOverlap) {
                return true;
            }
        }

        return false;
    }

    private function calculateBookedTime(Carbon $start, Carbon $end, $onlyVacations = false)
    {
        if ($start > Carbon::now()->startOfDay()) {
            return 0;
        }

        $qb = DB::table('project_efforts')->leftJoin('project_positions', 'project_efforts.position_id', '=', 'project_positions.id')
            ->leftJoin('projects', 'project_positions.project_id', '=', 'projects.id')
            ->leftJoin('rate_units', 'project_positions.rate_unit_id', '=', 'rate_units.id')
            ->where([
                ['project_efforts.deleted_at', '=', null],
                ['project_efforts.date', '>', $start->subDay()->endOfDay()],
                ['project_efforts.date', '<', $end->addDay()->startOfDay()],
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
        $closest_end = Carbon::parse($this->start)->subCentury();

        $wps = WorkPeriod::where([
                ['deleted_at', '=', null],
                ['employee_id', '=', $this->employee->id],
                ['end', '<', $this->start],
                ['id', '!=', $this->id],
            ])->get();

        foreach ($wps as $wp) {
            $wp_end = Carbon::parse($wp->end)->endOfDay();

            if ($wp_end > $closest_end) {
                $closest_end = $wp_end;
            }
        }

        $candidates = array();

        foreach ($wps as $wp) {
            $wp_end = Carbon::parse($wp->end)->endOfDay();

            if ($wp_end >= $closest_end) {
                array_push($candidates, $wp);
            }
        }

        $furthest_start = null;

        foreach ($candidates as $wp) {
            if (is_null($furthest_start)) {
                $furthest_start = $wp;
            } else {
                $fs_start = Carbon::parse($furthest_start->start)->endOfDay();
                $wp_start = Carbon::parse($wp->start)->endOfDay();

                if ($wp_start < $fs_start) {
                    $furthest_start = $wp;
                }
            }
        }

        return $furthest_start;
    }

    private function isFirstPeriod()
    {
        $wps = WorkPeriod::where([
            ['deleted_at', '=', null],
            ['employee_id', '=', $this->employee->id],
            ['start', '<', $this->start],
            ['id', '!=', $this->id],
        ])->get();

        $isFirst = count($wps) == 0;

        return $isFirst;
    }
}
