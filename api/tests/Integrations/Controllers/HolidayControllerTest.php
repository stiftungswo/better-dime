<?php

namespace Tests\Integrations\Controllers;

use App\Models\Employee\Holiday;
use Laravel\Lumen\Testing\DatabaseTransactions;

class HolidayControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testValidDuplicate()
    {
        $holidayTemplate = factory(Holiday::class)->create();
        $this->asAdmin()->json('POST', 'api/v1/holidays/' . $holidayTemplate->id . '/duplicate')->assertResponseOk();
        $this->assertResponseMatchesTemplate(json_decode($holidayTemplate->toJson(), true), true);
    }

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
        $this->asAdmin()->json('POST', 'api/v1/holidays', $this->holidayTemplate())->assertResponseOk();
        $this->assertResponseMatchesTemplate($this->holidayTemplate());
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/holidays/1789764', $this->holidayTemplate())->assertResponseStatus(404);
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
        $this->asAdmin()->json('PUT', 'api/v1/holidays/' . $holidayId, $this->holidayTemplate())->assertResponseOk();
        $this->assertResponseMatchesTemplate($this->holidayTemplate());
    }

    private function holidayTemplate()
    {
        return [
            'date' => (new \DateTime())->format('Y-m-d'),
            'duration' => 400,
            'name' => 'Bring-deinen-Hund-mit-zur-Arbeit Tag'
        ];
    }
}
