<?php

namespace App\Services\Export;

use App\Models\Project\ProjectEffort;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ServiceHoursReport implements FromArray, ShouldAutoSize
{
    private $efforts;

    public function __construct(Collection $projectEfforts)
    {
        $this->efforts = $projectEfforts;
    }

    public function array() : array
    {
        $sumPerService = [];
        $sumPerProject = [];

        foreach ($this->efforts as $projectEffort) {
            /** @var ProjectEffort $projectEffort */
            if (!is_null($projectEffort->project) && !is_null($projectEffort->service) && $projectEffort->position->rate_unit->is_time) {
                if (!isset($sumPerProject[$projectEffort->project->name])) {
                    $sumPerProject[$projectEffort->project->name] = [];
                    $sumPerProject[$projectEffort->project->name]['category_id'] = $projectEffort->project->category_id;
                    $sumPerProject[$projectEffort->project->name]['category_name'] = $projectEffort->project->category ? $projectEffort->project->category->name : '';
                    $sumPerProject[$projectEffort->project->name]['name'] = $projectEffort->project->name;
                }

                if (!isset($sumPerProject[$projectEffort->project->name][$projectEffort->service->name])) {
                    $sumPerProject[$projectEffort->project->name][$projectEffort->service->name] = 0;
                }

                if (!isset($sumPerService[$projectEffort->service->name])) {
                    $sumPerService[$projectEffort->service->name] = 0;
                }

                $sumPerProject[$projectEffort->project->name][$projectEffort->service->name] += $projectEffort->value;
                $sumPerService[$projectEffort->service->name] += $projectEffort->value;
            }
        }

        ksort($sumPerProject);
        ksort($sumPerService);
        $servicesWithWorkForPeriod = array_keys($sumPerService);
        $contentRows = [];

        // prepare the heading row
        $headingRow = array_merge(['Projekt', 'Tätigkeitsbereich ID', 'Tätigkeitsbereich'], $servicesWithWorkForPeriod);
        $contentRows[] = $headingRow;

        foreach ($sumPerProject as $projectWithServicesSum) {
            $contentRow = [];

            for ($i = 0; $i < count($sumPerService); $i++) {
                $contentRow[] = empty($projectWithServicesSum[$servicesWithWorkForPeriod[$i]]) ? 0 : $projectWithServicesSum[$servicesWithWorkForPeriod[$i]] / 60; // convert the stored minutes to hours
            }

            array_unshift($contentRow, $projectWithServicesSum['name'], $projectWithServicesSum['category_id'], $projectWithServicesSum['category_name']);
            $contentRows[] = $contentRow;
        }

        $sortedSumsPerService = collect(array_values($sumPerService));
        // transform the values from minutes to hours
        $sortedSumsPerService = $sortedSumsPerService->map(function ($sum) {
            return $sum / 60;
        })->toArray();
        array_unshift($sortedSumsPerService, 'Total', '', '');
        $contentRows[] = $sortedSumsPerService;

        return $contentRows;
    }
}
