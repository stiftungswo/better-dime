<?php

namespace Tests\Unit\Models\Project;

use App\Models\Employee\Employee;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;
use App\Models\Service\Service;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ProjectEffortTest extends \TestCase
{
    use DatabaseTransactions;

    public function testEmployeeAssignment()
    {
        $employee = factory(Employee::class)->make();
        $effort = factory(ProjectEffort::class)->make();
        $effort->employee()->associate($employee);
        $this->assertEquals($employee, $effort->employee);
    }

    public function testProjectPositionAssignment()
    {
        $position = factory(ProjectPosition::class)->make();
        $effort = factory(ProjectEffort::class)->make();
        $effort->position()->associate($position);
        $this->assertEquals($position, $effort->position);
    }

    public function testGetNullService()
    {
        $position = factory(ProjectPosition::class)->make();
        $effort = factory(ProjectEffort::class)->make();
        $effort->position()->associate($position);
        $this->assertNull($effort->service);
    }

    public function testGetService()
    {
        $service = factory(Service::class)->create();
        $position = factory(ProjectPosition::class)->create([
            'service_id' => $service->id
        ]);
        $effort = factory(ProjectEffort::class)->create([
            'position_id' => $position->id
        ]);
        $this->assertEquals($service->id, $effort->service->id);
    }
}
