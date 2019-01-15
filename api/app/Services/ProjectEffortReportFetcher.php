<?php

namespace App\Services;

use App\Services\Filter\ProjectCommentFilter;
use App\Services\Filter\ProjectEffortFilter;

class ProjectEffortReportFetcher
{
    /**
     * Squashes project comments and project efforts into one array, sorted by date
     * You can pass an empty string to start or end if you want all efforts
     * @param int $project_id
     * @param string $start
     * @param string $end
     * @return array
     */
    public static function fetch(int $project_id, $start, $end)
    {
        $efforts = ProjectEffortFilter::fetchSummary([
            'end' => $end,
            'project_ids' => $project_id,
            'start' => $start,
        ]);

        $comments = ProjectCommentFilter::fetch([
            'end' => $end,
            'project_id' => $project_id,
            'start' => $start,
        ]);

        // sort in stuff
        $commentsAndEffortsPerDate = [];
        $efforts->each(function ($e) use (&$commentsAndEffortsPerDate) {
            if (!array_key_exists($e->efforts_date, $commentsAndEffortsPerDate)) {
                $commentsAndEffortsPerDate[$e->efforts_date] = [];
            }
            $commentsAndEffortsPerDate[$e->efforts_date]['efforts'][] = (array)$e;
        });

        $comments->each(function ($c) use (&$commentsAndEffortsPerDate) {
            if (!array_key_exists($c->date, $commentsAndEffortsPerDate)) {
                $commentsAndEffortsPerDate[$c->date] = [];
            }
            $commentsAndEffortsPerDate[$c->date]['comments'][] = (array)$c;
        });

        ksort($commentsAndEffortsPerDate);

        return $commentsAndEffortsPerDate;
    }
}
