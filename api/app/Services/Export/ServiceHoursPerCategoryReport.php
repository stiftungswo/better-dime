<?php

namespace App\Services\Export;

use App\Models\Project\ProjectEffort;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ServiceHoursPerCategoryReport implements FromArray, ShouldAutoSize
{
    private $efforts;

    public function __construct(Collection $projectEfforts)
    {
        $this->efforts = $projectEfforts;
    }

    public function array() : array
    {
        $sumPerService = [];
        $sumPerProjectCategory = [];
        $sumPerProjectCategory['no_category'] = [
            'category_id' => '',
            'category_name' => 'Projekte ohne Tätigkeitsbereich'
        ];

        foreach ($this->efforts as $projectEffort) {
            /** @var ProjectEffort $projectEffort */
            if (!is_null($projectEffort->project) && !is_null($projectEffort->service) && $projectEffort->position->rate_unit->is_time) {
                $serviceName = $projectEffort->service->name;

                // if category is null, add it to a general position
                if (is_null($projectEffort->project->category)) {
                    $categoryName = 'no_category';
                } else {
                    $categoryName = $projectEffort->project->category->name;
                }

                if (!isset($sumPerProjectCategory[$categoryName])) {
                    $sumPerProjectCategory[$categoryName] = [];
                    $sumPerProjectCategory[$categoryName]['category_id'] = $projectEffort->project->category_id;
                    $sumPerProjectCategory[$categoryName]['category_name'] = $projectEffort->project->category->name;
                }

                if (!isset($sumPerProjectCategory[$categoryName][$serviceName])) {
                    $sumPerProjectCategory[$categoryName][$serviceName] = 0;
                }

                if (!isset($sumPerService[$serviceName])) {
                    $sumPerService[$serviceName] = 0;
                }

                $sumPerProjectCategory[$categoryName][$serviceName] += $projectEffort->value;
                $sumPerService[$serviceName] += $projectEffort->value;
            }
        }

        ksort($sumPerProjectCategory);
        ksort($sumPerService);
        $servicesWithWorkForPeriod = array_keys($sumPerService);
        $contentRows = [];

        // prepare the heading row
        $headingRow = array_merge(['Tätigkeitsbereich ID', 'Tätigkeitsbereich'], $servicesWithWorkForPeriod);
        $contentRows[] = $headingRow;

        foreach ($sumPerProjectCategory as $projectCategoryWithServiceSum) {
            $contentRow = [];

            for ($i = 0; $i < count($sumPerService); $i++) {
                $contentRow[] = empty($projectCategoryWithServiceSum[$servicesWithWorkForPeriod[$i]]) ? 0 : $projectCategoryWithServiceSum[$servicesWithWorkForPeriod[$i]] / 60; // convert the stored minutes to hours
            }

            array_unshift($contentRow, $projectCategoryWithServiceSum['category_id'], $projectCategoryWithServiceSum['category_name']);
            $contentRows[] = $contentRow;
        }

        $sortedSumsPerService = collect(array_values($sumPerService));
        // transform the values from minutes to hours
        $sortedSumsPerService = $sortedSumsPerService->map(function ($sum) {
            return $sum / 60;
        })->toArray();
        array_unshift($sortedSumsPerService, 'Total', '');
        $contentRows[] = $sortedSumsPerService;

        return $contentRows;
    }
}
