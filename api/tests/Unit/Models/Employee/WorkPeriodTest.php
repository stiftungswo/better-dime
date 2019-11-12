<?php

namespace Tests\Unit\Models\Employee;

use App\Models\Employee\Holiday;
use App\Models\Employee\WorkPeriod;
use Laravel\Lumen\Testing\DatabaseTransactions;

class WorkPeriodTest extends \TestCase
{
    use DatabaseTransactions;

    public function testEffectiveTimeAttribute()
    {
        $employeeId = factory(\App\Models\Employee\Employee::class)->create()->id;
        $projectId = factory(\App\Models\Project\Project::class)->create(['vacation_project' => false])->id;
        $timeRateUnitId = factory(\App\Models\Service\RateUnit::class)->create(['is_time' => true])->id;
        $materialRateUnitId = factory(\App\Models\Service\RateUnit::class)->create(['is_time' => false])->id;
        $timePosition = factory(\App\Models\Project\ProjectPosition::class)->create(['project_id' => $projectId, 'rate_unit_id' => $timeRateUnitId]);
        $materialPosition = factory(\App\Models\Project\ProjectPosition::class)->create(['project_id' => $projectId, 'rate_unit_id' => $materialRateUnitId]);

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

        // this should not matter, it counts everything
        $this->assertEquals(3 * 504, $workPeriod->effective_time);

        // lets make it a bit longer, until the last effort, so it should count everything
        $workPeriod->update(['end' => '2020-02-01']);
        $this->assertEquals(9 * 504, $workPeriod->effective_time);

        // lets move the start back, so it returns 0, because the period did not start yet
        $workPeriod->update(['start' => '2050-06-01']);
        $this->assertEquals(0, $workPeriod->effective_time);
    }

    public function testTargetTimeAttribute()
    {
        // truncate holidays so they dont get between us and our results
        Holiday::truncate();

        // this tests also includes the period_vacation_budget attribute
        // not directly, but indirectly because it is included in the calculation
        factory(Holiday::class)->create(['date' => '2019-01-01', 'duration' => 504]);
        factory(Holiday::class)->create(['date' => '2019-01-02', 'duration' => 504]);
        factory(Holiday::class)->create(['date' => '2019-08-01', 'duration' => 504]);
        factory(Holiday::class)->create(['date' => '2019-10-31', 'duration' => 60]);

        // start, end, vacation takeover, pensum, yearly_vacation_budget, expected_result
        $testDataset = [
            ['2019-01-01', '2019-01-31', 0, 100, 10080, 10584],
            ['2018-12-01', '2019-03-03', 500, 100, 10080, 31752],
            ['2018-12-01', '2020-03-02', 1500, 80, 12600, 130186],
            ['2018-12-01', '2020-03-02', 1500, 100, 12600, 162732],
            ['2019-01-01', '2019-12-31', 750, 100, 10080, 129972],
        ];

        foreach ($testDataset as $testData) {
            $employeeId = factory(\App\Models\Employee\Employee::class)->create()->id;
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
        $this->assertEquals(3 * 504 - $workPeriod->target_time, $workPeriod->effort_till_today);
    }

    public function testRemainingVacationBudgetAttribute()
    {
        $employeeId = factory(\App\Models\Employee\Employee::class)->create()->id;
        $projectId = factory(\App\Models\Project\Project::class)->create(['vacation_project' => true])->id;
        $timeRateUnitId = factory(\App\Models\Service\RateUnit::class)->create(['is_time' => true])->id;
        $materialRateUnitId = factory(\App\Models\Service\RateUnit::class)->create(['is_time' => false])->id;
        $timePosition = factory(\App\Models\Project\ProjectPosition::class)->create(['project_id' => $projectId, 'rate_unit_id' => $timeRateUnitId]);
        $materialPosition = factory(\App\Models\Project\ProjectPosition::class)->create(['project_id' => $projectId, 'rate_unit_id' => $materialRateUnitId]);

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
        $this->assertEquals($workPeriod->period_vacation_budget - 3 * 504, $workPeriod->remaining_vacation_budget);

        // lets move the start back, so it returns 0, because the period did not start yet
        $workPeriod->update(['start' => '2019-06-01']);
        $this->assertEquals($workPeriod->period_vacation_budget - 0, $workPeriod->remaining_vacation_budget);
    }
}
