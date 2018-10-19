<?php

namespace tests\integrations;

use App\Modules\Employee\Models\Employee;
use Laravel\Lumen\Testing\DatabaseTransactions;

class EmployeeControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/employees/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $employeeId = factory(Employee::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/employees/' . $employeeId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testIndex()
    {
        $employeeId = factory(Employee::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/employees')->assertResponseOk();
        $decodedResponse = $this->responseToArray();
        $this->assertEquals($employeeId, $decodedResponse[count($decodedResponse)-2]['id']);
    }

    public function testPasswordIsHashed()
    {
        $this->asAdmin()->json('POST', 'api/v1/employees/', [
            'email' => 'test@stiftungswo.ch',
            'password' => 'gurken',
            'first_name' => 'Max',
            'last_name' => 'Muster',
        ]);

        $this->assertResponseOk();

        $e = Employee::orderBy('id', 'desc')->first();

        $this->assertEquals('test@stiftungswo.ch', $e->email);
        $this->assertStringStartsWith('$', $e->password);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/employees/1789764', [
            'email' => 'test@stiftungswo.ch',
            'password' => 'gurken',
            'first_name' => 'Max',
            'last_name' => 'Muster',
        ])->assertResponseStatus(404);
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
        $template = [
            'email' => 'test@stiftungswo.ch',
            'first_name' => 'Max',
            'last_name' => 'Muster',
        ];
        $this->asAdmin()->json('PUT', 'api/v1/employees/' . $employeeId, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }
}
