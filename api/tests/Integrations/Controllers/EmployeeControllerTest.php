<?php

namespace Tests\Integrations\Controllers;

use App\Models\Employee\Employee;
use Laravel\Lumen\Testing\DatabaseTransactions;

class EmployeeControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testArchive()
    {
        $project = factory(Employee::class)->create([
            'archived' => false
        ]);
        $this->assertFalse($project->archived);
        $this->asAdmin()->json('PUT', 'api/v1/employees/' . $project->id . '/archive', [
            'archived' => true
        ])->assertResponseOk();
        $this->assertTrue($project->refresh()->archived);
    }

    public function testArchiveRestore()
    {
        $project = factory(Employee::class)->create([
            'archived' => true
        ]);
        $this->assertTrue($project->archived);
        $this->asAdmin()->json('PUT', 'api/v1/employees/' . $project->id . '/archive', [
            'archived' => false
        ])->assertResponseOk();
        $this->assertFalse($project->refresh()->archived);
    }

    public function testValidDuplicate()
    {
        $employeeTemplate = factory(Employee::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/employees/' . $employeeTemplate->id);
        $template = $this->responseToArray();

        $this->asAdmin()->json('POST', 'api/v1/employees/' . $employeeTemplate->id . '/duplicate')->assertResponseOk();
        $this->assertResponseMatchesTemplate($template, true);
    }

    public function testIndex()
    {
        $employeeId = factory(Employee::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/employees')->assertResponseOk();
        $decodedResponse = $this->responseToArray();
        $this->assertEquals($employeeId, $decodedResponse[count($decodedResponse) - 2]['id']);
    }

    public function testPasswordIsHashed()
    {
        $template = $template = $this->employeeTemplate();
        $template['password'] = 'gurken';
        $this->asAdmin()->json('POST', 'api/v1/employees/', $template);
        $this->assertResponseOk();

        $e = Employee::orderBy('id', 'desc')->first();

        $this->assertEquals('test@stiftungswo.ch', $e->email);
        $this->assertStringStartsWith('$', $e->password);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/employees/1789764', $template = $this->employeeTemplate())->assertResponseStatus(404);
    }

    /*public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $employeeId = factory(Employee::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/employees/' . $employeeId, [])->assertResponseStatus(422);
    }*/

    public function testValidPut()
    {
        $employeeId = factory(Employee::class)->create()->id;
        $template = $this->employeeTemplate();
        $this->asAdmin()->json('PUT', 'api/v1/employees/' . $employeeId, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    private function employeeTemplate()
    {
        return [
            'archived' => false,
            'can_login' => true,
            'email' => 'test@stiftungswo.ch',
            'first_name' => 'Max',
            'holidays_per_year' => 25,
            'is_admin' => false,
            'last_name' => 'Muster',
        ];
    }
}
