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

    protected $appends = ['effort_till_today', 'period_vacation_budget', 'target_time', 'vacation_till_today'];

    protected $hidden = ['employee'];

    protected $fillable = ['employee_id', 'end', 'pensum', 'start', 'vacation_takeover', 'yearly_vacation_budget'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function getTargetTimeAttribute()
    {
        $weekdays = Carbon::parse($this->start)->diffInWeekdays(Carbon::parse($this->end)->addDay());
        $pensum = $this->pensum / 100;
        $targetTimeWithoutVacations = $weekdays * 8.4 * 60 * $pensum;
        $paidTimeInDateRange = Holiday::paidTimeInDateRange($this->start, $this->end);
        return round($targetTimeWithoutVacations - $this->period_vacation_budget - $paidTimeInDateRange, 0);
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
            $daysOfYear = ($start->diffInDays($end) + 1) * 8.4 * 60;

            if ($this->start > $start) {
                $start = $workPeriodStart;
            }

            if ($this->end < $end) {
                $end = $workPeriodEnd;
            }

            $daysInYearPeriod = ($start->diffInDays($end) + 1) * 8.4 * 60;
            $holidayMinutes += ($vacationEntitlement / $daysOfYear) * $daysInYearPeriod;
        }

        $vacationForPensum = $holidayMinutes * $pensum;
        $vacationForPensum += $this->vacation_takeover;

        return round($vacationForPensum, 0);
    }

    public function getEffortTillTodayAttribute()
    {
        if ($this->start > Carbon::now()) {
            return 0;
        } else {
            $start = Carbon::parse($this->start);
        }

        if ($this->end < Carbon::now()) {
            $end = Carbon::parse($this->end);
        } else {
            $end = Carbon::now();
        }

        $paidTimeInDateRange = Holiday::paidTimeInDateRange($this->start, $this->end);

        return round(DB::table('project_efforts')->leftJoin('project_positions', 'project_efforts.position_id', '=', 'project_positions.id')
            ->leftJoin('projects', 'project_positions.project_id', '=', 'projects.id')
            ->leftJoin('rate_units', 'project_positions.rate_unit_id', '=', 'rate_units.id')
            ->where([
                ['project_efforts.date', '>=', $start->subDay()],
                ['project_efforts.date', '<=', $end->addDay()],
                ['project_efforts.employee_id', '=', $this->employee->id],
                ['projects.vacation_project', '=', false],
                ['rate_units.is_time', '=', true]
            ])->sum('project_efforts.value') - $paidTimeInDateRange, 0);
    }

    public function getVacationTillTodayAttribute()
    {
        if ($this->start > Carbon::now()) {
            return 0;
        } else {
            $start = Carbon::parse($this->start);
        }

        if ($this->end < Carbon::now()) {
            $end = Carbon::parse($this->end);
        } else {
            $end = Carbon::now();
        }

        return round(DB::table('project_efforts')->leftJoin('project_positions', 'project_efforts.position_id', '=', 'project_positions.id')
            ->leftJoin('projects', 'project_positions.project_id', '=', 'projects.id')
            ->leftJoin('rate_units', 'project_positions.rate_unit_id', '=', 'rate_units.id')
            ->where([
                ['project_efforts.date', '>=', $start->subDay()],
                ['project_efforts.date', '<=', $end->addDay()],
                ['project_efforts.employee_id', '=', $this->employee->id],
                ['projects.vacation_project', '=', true],
                ['rate_units.is_time', '=', true]
            ])->sum('project_efforts.value'), 0);
    }
}
