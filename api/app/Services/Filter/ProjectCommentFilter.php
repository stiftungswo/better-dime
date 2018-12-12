<?php

namespace App\Services\Filter;

use Illuminate\Support\Facades\DB;

class ProjectCommentFilter
{

    /**
     * Returns all project comments based on a few filters
     * @param array $params
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function fetch($params = [])
    {
        $queryBuilder = DB::table('project_comments')->orderBy('date')->whereNull('deleted_at');

        if (!empty($params['end'])) {
            $queryBuilder->where('date', '<=', $params['end']);
        }

        if (!empty($params['project_id'])) {
            $queryBuilder->where('project_id', '=', $params['project_id']);
        }

        if (!empty($params['start'])) {
            $queryBuilder->where('date', '>=', $params['start']);
        }

        return $queryBuilder->get();
    }
}
