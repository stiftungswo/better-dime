<?php

namespace Tests\Integrations\Controllers;

use App\Models\Service\RateUnit;
use Laravel\Lumen\Testing\DatabaseTransactions;

class RateUnitControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testArchive()
    {
        $rateUnit = factory(RateUnit::class)->create([
            'archived' => false
        ]);
        $this->assertFalse($rateUnit->archived);
        $this->asAdmin()->json('PUT', 'api/v1/rate_units/' . $rateUnit->id . '/archive', [
            'archived' => true
        ])->assertResponseOk();
        $this->assertTrue($rateUnit->refresh()->archived);
    }

    public function testArchiveRestore()
    {
        $rateUnit = factory(RateUnit::class)->create([
            'archived' => true
        ]);
        $this->assertTrue($rateUnit->archived);
        $this->asAdmin()->json('PUT', 'api/v1/rate_units/' . $rateUnit->id . '/archive', [
            'archived' => false
        ])->assertResponseOk();
        $this->assertFalse($rateUnit->refresh()->archived);
    }

    public function testIndex()
    {
        $rateUnitId = factory(RateUnit::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/rate_units')->assertResponseOk();
        $decodedResponse = $this->responseToArray();
        $this->assertEquals($rateUnitId, end($decodedResponse)['id']);
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
        $template = $this->rateUnitTemplate();
        $this->asAdmin()->json('POST', 'api/v1/rate_units', $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/rate_units/1789764', $this->rateUnitTemplate())->assertResponseStatus(404);
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
        $template = $this->rateUnitTemplate();
        $this->asAdmin()->json('PUT', 'api/v1/rate_units/' . $rateUnitId, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    private function rateUnitTemplate()
    {
        return [
            'archived' => true,
            'billing_unit' => 'CHF / h',
            'effort_unit' => 'h',
            'factor' => 2,
            'is_time' => true,
            'name' => "Huba Banana"
        ];
    }
}
