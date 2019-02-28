<?php

namespace App\Services\Export;

use App\Services\Filter\RevenuePosition;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

/*
 * Input: an array of CostgroupPosition:
 *
 *     {
        "source": "project",
        "name": "et sit ut",
        "category": "omnis",
        "customer": "Rohner Mettler AG",
        "created": [php date],
        "accountant": "Nils Schmidt",
        "offer_price": 18449746,
        "project_price": 46044711.911999986,
        "invoice_price": 46044691.36,
        "costgroup_values": {
            "rerum (9227) ": -2025967324.1279993,
            "quidem (781) ": -828804814.4159997,
            "sequi (831) ": 1381341357.3599997,
            "velit (4848) ": 1473430781.1839995
        }
    },

 */

class CostgroupReport implements FromArray, ShouldAutoSize
{
    private $efforts;
    private $employees;
    private $costgroups;

    public function __construct(Collection $efforts, Collection $costgroups)
    {
        $this->employees = $efforts->map(function ($effort) {
            return ['name' => $effort->employee->fullName];
        })->unique()->keyBy('name')->toArray();

        $efforts->map(function ($effort) {
            $name = $effort->employee->fullName;
            $valueRaw = $effort->value;
            $costgroupCount = $effort->project->costgroup_distributions->count();

            if ($costgroupCount == 1) {
                $number = $effort->project->costgroup_distributions->first()->costgroup_number;

                if (!isset($this->employees[$name][$number])) {
                    $this->employees[$name][$number] = 0;
                }
                $this->employees[$name][$number] += $valueRaw;
            } else {
                $fullWeight = $effort->project->costgroup_distributions->sum('weight');
                foreach ($effort->project->costgroup_distributions as $costgroup) {
                    $number = $costgroup->costgroup_number;
                    $weight = $costgroup->weight;

                    if (!isset($this->employees[$name][$number])) {
                        $this->employees[$name][$number] = 0;
                    }
                    $this->employees[$name][$number] += $valueRaw * ($weight/$fullWeight);
                }
            }
        });

        $this->costgroups = $costgroups->map(function ($costgroup) {
            return $costgroup->number;
        })->toArray();

        sort($this->costgroups);
        array_values($this->employees);
        sort($this->employees);
    }

    public function array(): array
    {
        $baseHeaders = ['Name'];

        $headers = array_merge($baseHeaders, $this->costgroups);

        $rows = [$headers];

        foreach ($this->employees as $employee) {
            $row = [];
            $row[] = $employee['name'];

            foreach ($this->costgroups as $costgroup) {
                if (array_key_exists($costgroup, $employee)) {
                    $row[] = $employee[$costgroup] / 60 . "h";
                } else {
                    $row[] = null;
                }
            }

            $rows[] = $row;
        }
        return $rows;
    }
}
