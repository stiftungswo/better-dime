<?php

namespace App\Services\Filter;

use Illuminate\Support\Facades\DB;

class ProjectEffortFilter
{
    public static function fetchSummary($params = [])
    {
        return self::fetch($params)
            ->groupBy('efforts_date')
            ->groupBy('position_description')
            ->groupBy('effort_unit_is_time')
            ->groupBy('effort_unit_factor')
            ->groupBy('effort_unit_name')
            ->select([
                DB::raw('SUM(project_efforts.value) as efforts_sum'),
                DB::raw('project_efforts.date as efforts_date'),
                DB::raw('project_positions.description as position_description'),
                DB::raw('rate_units.is_time as effort_unit_is_time'),
                DB::raw('rate_units.factor as effort_unit_factor'),
                DB::raw('rate_units.name as effort_unit_name'),
            ])->get();
    }

    public static function fetchList($params = [])
    {
        return self::fetch($params)->select([
            DB::raw('project_efforts.id as id'),
            DB::raw('project_efforts.date as date'),
            DB::raw('project_efforts.value as effort_value'),
            DB::raw('project_efforts.employee_id as effort_employee_id'),
            DB::raw('project_positions.description as position_description'),
            DB::raw('projects.id as project_id'),
            DB::raw('projects.name as project_name'),
            DB::raw('services.id as service_id'),
            DB::raw('services.name as service_name'),
            DB::raw('concat(employees.first_name, \' \', employees.last_name) as employee_full_name'),
            DB::raw('rate_units.effort_unit as effort_unit'),
            DB::raw('rate_units.factor as rate_unit_factor'),
            DB::raw('rate_units.is_time as rate_unit_is_time'),
        ])->get();
    }

    /**
     * Returns a query builder for efforts based on multiple parameters
     * @param array $params
     * @return \Illuminate\Database\Query\Builder
     */
    private static function fetch($params = [])
    {
        $queryBuilder = DB::table('project_efforts')
            ->leftJoin('project_positions', 'project_efforts.position_id', '=', 'project_positions.id')
            ->leftJoin('projects', 'project_positions.project_id', '=', 'projects.id')
            ->leftJoin('services', 'project_positions.service_id', '=', 'services.id')
            ->leftJoin('employees', 'project_efforts.employee_id', '=', 'employees.id')
            ->leftJoin('rate_units', 'project_positions.rate_unit_id', '=', 'rate_units.id')
            ->whereNull('project_efforts.deleted_at');

        if (!empty($params['employee_ids'])) {
            $queryBuilder = $queryBuilder->whereIn('project_efforts.employee_id', explode(',', $params['employee_ids']));
        }

        if (!empty($params['project_ids'])) {
            $queryBuilder = $queryBuilder->whereIn('project_positions.project_id', explode(',', $params['project_ids']));
        }

        if (!empty($params['service_ids'])) {
            $queryBuilder = $queryBuilder->whereIn('project_positions.service_id', explode(',', $params['service_ids']));
        }

        if (!empty($params['start'])) {
            $queryBuilder = $queryBuilder->where('project_efforts.date', '>=', $params['start']);
        }

        if (!empty($params['end'])) {
            $queryBuilder = $queryBuilder->where('project_efforts.date', '<=', $params['end']);
        }

        return $queryBuilder;
    }
}
