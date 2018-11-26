<?php

namespace Tests\Integrations\Controllers;

use App\Models\Employee\EmployeeSetting;
use Laravel\Lumen\Testing\DatabaseTransactions;

class EmployeeSettingControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/employee_settings/1789764', $this->employeeSettingTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $employeeSettingId = factory(EmployeeSetting::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/employee_settings/' . $employeeSettingId, [])->assertResponseStatus(422);
    }

    public function testValidPut()
    {
        $employeeSettingId = factory(EmployeeSetting::class)->create()->id;
        $template = $this->employeeSettingTemplate();
        $this->asAdmin()->json('PUT', 'api/v1/employee_settings/' . $employeeSettingId, $template);
        $this->assertResponseMatchesTemplate($template);
    }

    private function employeeSettingTemplate()
    {
        return [
            'employee_id' => factory(\App\Models\Employee\Employee::class)->create()->id
        ];
    }
}
