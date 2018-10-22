<?php

namespace Tests\Integrations;

use App\Models\Service\RateUnit;
use Laravel\Lumen\Testing\DatabaseTransactions;

class RateUnitControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testIndex()
    {
        $rateUnitId = factory(RateUnit::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/rate_units')->assertResponseOk();
        $decodedResponse = $this->responseToArray();
        $this->assertEquals($rateUnitId, end($decodedResponse)['id']);
    }

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/rate_units/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $rateUnitId = factory(RateUnit::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/rate_units/' . $rateUnitId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testInvalidGet()
    {
        // can't get because object does not exist
        $this->asAdmin()->json('GET', 'api/v1/rate_units/1789764')->assertResponseStatus(404);
    }

    public function testValidGet()
    {
        $rateUnit = factory(RateUnit::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/rate_units/' . $rateUnit->id)->assertResponseOk();
        $this->assertEquals($rateUnit->effort_unit, $this->responseToArray()['effort_unit']);
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/rate_units', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = [
            'archived' => true,
            'billing_unit' => 'CHF / h',
            'effort_unit' => 'h',
            'factor' => 2
        ];
        $this->asAdmin()->json('POST', 'api/v1/rate_units', $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/rate_units/1789764', [
            'archived' => true,
            'billing_unit' => 'CHF / h',
            'effort_unit' => 'h',
            'factor' => 2
        ])->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $rateUnitId = factory(RateUnit::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/rate_units/' . $rateUnitId, [])->assertResponseStatus(422);
    }

    public function testValidPut()
    {
        $rateUnitId = factory(RateUnit::class)->create()->id;
        $template = [
            'archived' => true,
            'billing_unit' => 'CHF / h',
            'effort_unit' => 'h',
            'factor' => 2
        ];
        $this->asAdmin()->json('PUT', 'api/v1/rate_units/' . $rateUnitId, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }
}
