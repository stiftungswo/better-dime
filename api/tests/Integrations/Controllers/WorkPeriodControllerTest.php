<?php

namespace App\Http\Controllers;

use App\Models\Employee\Employee;
use App\Models\Employee\WorkPeriod;
use Laravel\Lumen\Testing\DatabaseTransactions;

class WorkPeriodControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/work_periods/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $workPeriodId = factory(WorkPeriod::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/work_periods/' . $workPeriodId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testIndexWithEmployeeParam()
    {
        $employeeId = factory(Employee::class)->create()->id;
        factory(WorkPeriod::class)->create([ 'employee_id' => $employeeId ]);
        factory(WorkPeriod::class)->create();

        $this->asAdmin()->json('GET', 'api/v1/work_periods?employee=' . $employeeId)->assertResponseOk();
        $this->assertCount(1, $this->responseToArray());
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/work_periods', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = $this->workPeriodTemplate();
        $this->asAdmin()->json('POST', 'api/v1/work_periods', $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/work_periods/1789764', $this->workPeriodTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $workPeriodId = factory(WorkPeriod::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/work_periods/' . $workPeriodId, [])->assertResponseStatus(422);
    }

    public function testValidPut()
    {
        $workPeriodId = factory(WorkPeriod::class)->create()->id;
        $template = $this->workPeriodTemplate();
        $this->asAdmin()->json('PUT', 'api/v1/work_periods/' . $workPeriodId, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    private function workPeriodTemplate()
    {
        return [
            'employee_id' => factory(Employee::class)->create()->id,
            'end' => '2019-01-01',
            'pensum' => 100,
            'start' => '2019-12-31',
            'vacation_takeover' => 16.8,
            'yearly_vacation_budget' => 20
        ];
    }
}
