<?php

namespace Tests\Unit\Models\Project;

use App\Models\Employee\Employee;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;

class ProjectEffortTest extends \TestCase
{
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
}
