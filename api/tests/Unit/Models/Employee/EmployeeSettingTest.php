<?php

namespace Tests\Unit\Models\Employee;

use App\Models\Employee\Employee;
use App\Models\Employee\EmployeeSetting;

class EmployeeSettingTest extends \TestCase
{
    public function testEmployeeAssignment()
    {
        $employee = factory(Employee::class)->make();
        $employeeSetting = factory(EmployeeSetting::class)->make();
        $this->assertNull($employeeSetting->employee);
        $employeeSetting->employee()->associate($employee);
        $this->assertEquals($employee, $employeeSetting->employee);
    }
}
