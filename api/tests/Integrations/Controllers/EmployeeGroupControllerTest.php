<?php

namespace Tests\Integrations\Controllers;

use App\Models\Employee\EmployeeGroup;
use Laravel\Lumen\Testing\DatabaseTransactions;

class EmployeeGroupControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testIndex()
    {
        $this->asAdmin()->json('GET', 'api/v1/employee_groups')->assertResponseOk();
    }

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/employee_groups/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $employeeGroupId = factory(EmployeeGroup::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/employee_groups/' . $employeeGroupId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/employee_groups', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $this->asAdmin()->json('POST', 'api/v1/employee_groups', $this->employeeGroupTemplate())->assertResponseOk();
        $this->assertResponseMatchesTemplate($this->employeeGroupTemplate());
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/employee_groups/1789764', $this->employeeGroupTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $employeeGroupId = factory(EmployeeGroup::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/employee_groups/' . $employeeGroupId, [])->assertResponseStatus(422);
    }

    public function testValidPut()
    {
        $employeeGroupId = factory(EmployeeGroup::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/employee_groups/' . $employeeGroupId, $this->employeeGroupTemplate())->assertResponseOk();
        $this->assertResponseMatchesTemplate($this->employeeGroupTemplate());
    }

    private function employeeGroupTemplate()
    {
        return [
            'name' => 'Mitarbeiter'
        ];
    }
}
