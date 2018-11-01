<?php

namespace Tests\Unit\Models\Employee;

use App\Models\Employee\Employee;
use App\Models\Employee\Holiday;
use App\Models\Employee\WorkPeriod;
use Laravel\Lumen\Testing\DatabaseTransactions;

class WorkPeriodTest extends \TestCase
{
    use DatabaseTransactions;

    public function testTargetTimeAttribute()
    {
        // this tests also includes the period_vacation_budget attribute
        // not directly, but indirectly because it is included in the calculation
        factory(Holiday::class)->create(['date' => '2019-01-01', 'duration' => 504]);
        factory(Holiday::class)->create(['date' => '2019-01-02', 'duration' => 504]);
        factory(Holiday::class)->create(['date' => '2019-08-01', 'duration' => 504]);
        factory(Holiday::class)->create(['date' => '2019-10-31', 'duration' => 60]);

        // start, end, vacation takeover, pensum, yearly_vacation_budget,expected_result
        $testDataset = [
            ['2019-01-01', '2019-01-31', 0, 100, 10080, 9728],
            ['2018-12-01', '2019-02-31', 500, 100, 10080, 28684],
            ['2018-12-01', '2020-02-31', 1500, 80, 12600, 115727],
            ['2018-12-01', '2020-02-31', 1500, 100, 12600, 145427],
            ['2019-01-01', '2019-12-31', 750, 100, 10080, 119142],
        ];

        foreach ($testDataset as $testData) {
            $employeeId = factory(Employee::class)->create()->id;
            $workPeriod = factory(WorkPeriod::class)->create([
                'employee_id' => $employeeId,
                'start' => $testData[0],
                'end' => $testData[1],
                'vacation_takeover' => $testData[2],
                'pensum' => $testData[3],
                'yearly_vacation_budget' => $testData[4],
            ]);

            $this->assertEquals($testData[5], $workPeriod->target_time);
        }
    }

    public function testEffortTillTodayAttribute()
    {
        $employeeId = factory(\App\Models\Employee\Employee::class)->create()->id;
        $projectId = factory(\App\Models\Project\Project::class)->create(['vacation_project' => false])->id;
        $timeRateUnitId = factory(\App\Models\Service\RateUnit::class)->create(['is_time' => true])->id;
        $materialRateUnitId = factory(\App\Models\Service\RateUnit::class)->create(['is_time' => false])->id;
        $timePosition = factory(\App\Models\Project\ProjectPosition::class)->create(['project_id' => $projectId, 'rate_unit_id' => $timeRateUnitId]);
        $materialPosition = factory(\App\Models\Project\ProjectPosition::class)->create(['project_id' => $projectId, 'rate_unit_id' => $materialRateUnitId]);

        // truncate holidays so they dont get between us and our results
        Holiday::truncate();

        // seed a few efforts for both positions
        $timePosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2018-09-30',
            'value' => 504
        ]));
        $timePosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2018-10-31',
            'value' => 504
        ]));
        $timePosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2020-01-31',
            'value' => 504
        ]));
        // seed a few efforts for both positions
        $materialPosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2018-09-30',
            'value' => 504
        ]));
        $materialPosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2018-10-31',
            'value' => 504
        ]));
        $materialPosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2020-01-31',
            'value' => 504
        ]));

        // lets check the following stuff
        // period ends earlier than today
        $workPeriod = factory(WorkPeriod::class)->create([
            'employee_id' => $employeeId,
            'start' => '2018-01-01',
            'end' => '2018-10-01'
        ]);

        // so it should only have 3 * 504 in it
        $this->assertEquals(3 * 504, $workPeriod->effort_till_today);

        // lets make it a bit longer, until the last effort, but it should only contain 6 * 504
        $workPeriod->update(['end' => '2020-02-01']);
        $this->assertEquals(6 * 504, $workPeriod->effort_till_today);

        // lets move the start back, so it returns 0, because the period did not start yet
        $workPeriod->update(['start' => '2019-06-01']);
        $this->assertEquals(0, $workPeriod->effort_till_today);
    }

    public function testVacationTillTodayAttribute()
    {
        $employeeId = factory(\App\Models\Employee\Employee::class)->create()->id;
        $projectId = factory(\App\Models\Project\Project::class)->create(['vacation_project' => true])->id;
        $timeRateUnitId = factory(\App\Models\Service\RateUnit::class)->create(['is_time' => true])->id;
        $materialRateUnitId = factory(\App\Models\Service\RateUnit::class)->create(['is_time' => false])->id;
        $timePosition = factory(\App\Models\Project\ProjectPosition::class)->create(['project_id' => $projectId, 'rate_unit_id' => $timeRateUnitId]);
        $materialPosition = factory(\App\Models\Project\ProjectPosition::class)->create(['project_id' => $projectId, 'rate_unit_id' => $materialRateUnitId]);

        // truncate holidays so they dont get between us and our results
        Holiday::truncate();

        // seed a few efforts for both positions
        $timePosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2018-09-30',
            'value' => 504
        ]));
        $timePosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2018-10-31',
            'value' => 504
        ]));
        $timePosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2020-01-31',
            'value' => 504
        ]));
        // seed a few efforts for both positions
        $materialPosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2018-09-30',
            'value' => 504
        ]));
        $materialPosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2018-10-31',
            'value' => 504
        ]));
        $materialPosition->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 3)->make([
            'employee_id' => $employeeId,
            'date' => '2020-01-31',
            'value' => 504
        ]));

        // lets check the following stuff
        // period ends earlier than today
        $workPeriod = factory(WorkPeriod::class)->create([
            'employee_id' => $employeeId,
            'start' => '2018-01-01',
            'end' => '2018-10-01'
        ]);

        // so it should only have 3 * 504 in it
        $this->assertEquals(3 * 504, $workPeriod->vacation_till_today);

        // lets make it a bit longer, until the last effort, but it should only contain 6 * 504
        $workPeriod->update(['end' => '2020-02-01']);
        $this->assertEquals(6 * 504, $workPeriod->vacation_till_today);

        // lets move the start back, so it returns 0, because the period did not start yet
        $workPeriod->update(['start' => '2019-06-01']);
        $this->assertEquals(0, $workPeriod->vacation_till_today);
    }
}
