<?php

namespace Tests\Integrations;

use App\Modules\Employee\Models\Holiday;
use Laravel\Lumen\Testing\DatabaseTransactions;

class HolidayControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testIndex()
    {
        $holidayId = factory(Holiday::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/holidays')->assertResponseOk();
        $decodedResponse = $this->responseToArray();
        $this->assertEquals($holidayId, end($decodedResponse)['id']);
    }

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/holidays/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $holidayId = factory(Holiday::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/holidays/' . $holidayId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/holidays', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = [
            'date' => (new \DateTime())->format('Y-m-d'),
            'duration' => 400
        ];
        $this->asAdmin()->json('POST', 'api/v1/holidays', $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/holidays/1789764', [
            'date' => (new \DateTime())->format('Y-m-d'),
            'duration' => 400
        ])->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $holidayId = factory(Holiday::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/holidays/' . $holidayId, [])->assertResponseStatus(422);
    }

    public function testValidPut()
    {
        $holidayId = factory(Holiday::class)->create()->id;
        $template = [
            'date' => (new \DateTime())->format('Y-m-d'),
            'duration' => 400
        ];
        $this->asAdmin()->json('PUT', 'api/v1/holidays/' . $holidayId, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }
}
