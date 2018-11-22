<?php

namespace Tests\Unit\Services\Services\Filter;

use App\Models\Project\ProjectEffort;
use App\Services\Filter\ProjectEffortFilter;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ProjectEffortFilterTest extends \TestCase
{
    use DatabaseTransactions;

    public function testShouldListAllEffortsWithoutFilter()
    {
        factory(ProjectEffort::class)->create();
        $this->assertCount(count(ProjectEffort::all()), ProjectEffortFilter::fetchList());
    }

    public function testEmployeeParams()
    {
        $employeeId = factory(\App\Models\Employee\Employee::class)->create()->id;
        $employee2Id = factory(\App\Models\Employee\Employee::class)->create()->id;
        factory(ProjectEffort::class)->create(['employee_id' => $employeeId]);
        factory(ProjectEffort::class)->create(['employee_id' => $employee2Id]);

        $result = ProjectEffortFilter::fetchList(['employee_ids' => $employeeId]);
        $this->assertCount(1, $result);
        $this->assertEquals($employeeId, $result->first()->effort_employee_id);
    }

    public function testProjectParam()
    {
        $projectId = factory(\App\Models\Project\Project::class)->create()->id;
        $project2Id = factory(\App\Models\Project\Project::class)->create()->id;
        $projectPositionId = factory(\App\Models\Project\ProjectPosition::class)->create(['project_id' => $projectId])->id;
        $projectPosition2Id = factory(\App\Models\Project\ProjectPosition::class)->create(['project_id' => $project2Id])->id;
        factory(ProjectEffort::class)->create(['position_id' => $projectPositionId]);
        factory(ProjectEffort::class)->create(['position_id' => $projectPosition2Id]);

        $result = ProjectEffortFilter::fetchList(['project_ids' => $projectId]);
        $this->assertCount(1, $result);
        $this->assertEquals($projectId, $result->first()->project_id);
    }

    public function testServiceParam()
    {
        $serviceId = factory(\App\Models\Service\Service::class)->create()->id;
        $service2Id = factory(\App\Models\Service\Service::class)->create()->id;
        $projectPositionId = factory(\App\Models\Project\ProjectPosition::class)->create(['service_id' => $serviceId])->id;
        $projectPosition2Id = factory(\App\Models\Project\ProjectPosition::class)->create(['service_id' => $service2Id])->id;
        factory(ProjectEffort::class)->create(['position_id' => $projectPositionId]);
        factory(ProjectEffort::class)->create(['position_id' => $projectPosition2Id]);

        $result = ProjectEffortFilter::fetchList(['service_ids' => $serviceId]);
        $this->assertCount(1, $result);
        $this->assertEquals($serviceId, $result->first()->service_id);
    }

    public function testStartParam()
    {
        factory(ProjectEffort::class)->create(['date' => '2087-12-31']);
        factory(ProjectEffort::class)->create(['date' => '2088-01-01']);
        factory(ProjectEffort::class)->create(['date' => '2088-01-02']);

        $this->assertCount(2, ProjectEffortFilter::fetchList(['start' => '2088-01-01']));
    }

    public function testEndParam()
    {
        factory(ProjectEffort::class)->create(['date' => '1987-12-31']);
        factory(ProjectEffort::class)->create(['date' => '1988-01-01']);
        factory(ProjectEffort::class)->create(['date' => '1988-01-02']);

        $this->assertCount(2, ProjectEffortFilter::fetchList(['end' => '1988-01-01']));
    }
}
