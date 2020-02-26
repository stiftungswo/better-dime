<?php

namespace App\Services\Filter;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DailyEfforts
{
    public static function get(Carbon $from, Carbon $to)
    {
        $result = DB::table('project_efforts')
            ->join('employees', 'project_efforts.employee_id', '=', 'employees.id')
            ->join('project_positions', 'project_efforts.position_id', '=', 'project_positions.id')
            ->join('services', 'project_positions.service_id', '=', 'services.id')
            ->join('rate_units', 'project_positions.rate_unit_id', '=', 'rate_units.id')
            ->select('employee_id', 'first_name', 'last_name', 'date', 'project_efforts.value', 'service_id', 'services.name as service_name')
            ->where([
                ['rate_units.is_time', '=', true],
                ['project_efforts.deleted_at', '=', null]
            ])
            ->whereBetween('project_efforts.date', [$from->startOfDay(), $to->endOfDay()])
            ->orderBy('employees.first_name')
            ->get();

        $dates = [];
        $i = $from->copy();
        while ($i->lessThan($to)) {
            $dates[] = $i->format('Y-m-d');
            $i->addDay();
        }

        $employees = $result
            ->groupBy(['employee_id', 'date'])
            ->values()
            ->map(function ($employee) {
                $info = $employee->first()->first();
                return [
                "employee_id" => $info->employee_id,
                "name" => $info->first_name . " " . $info->last_name,
                "efforts" => $employee->map(function ($efforts) {
                    return $efforts->map(function ($effort) {
                        $effortCollection = new Collection($effort);
                        return $effortCollection->except(['employee_id', 'first_name', 'last_name']);
                    });
                })
                ];
            });

        return [
            "dates" => $dates,
            "employees" => $employees
        ];
    }
}
