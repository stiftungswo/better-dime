<?php

namespace Tests\Integrations\Controllers;

use App\Models\Service\RateGroup;
use App\Models\Service\RateUnit;
use App\Models\Service\Service;
use App\Models\Service\ServiceRate;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ServiceControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testGetServices()
    {
        factory(Service::class)->create();

        $this->asUser()->json('GET', 'api/v1/services/')
            ->assertResponseOk();
        $this->assertCount(count(Service::all()), $this->responseToArray());
    }

    public function testGetService()
    {
        $s = factory(Service::class)->create();

        $this->asUser()->json('GET', 'api/v1/services/' . $s->id)
            ->seeJson(["name" => $s->name])
            ->assertResponseOk();
    }

    public function testDeleteService()
    {
        $s = factory(Service::class)->create();

        $this->asUser()->json('DELETE', 'api/v1/services/' . $s->id)
            ->assertResponseOk();

        $this->assertEmpty(Service::find($s->id));
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/services', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = $this->serviceTemplate();
        $this->asAdmin()->json('POST', 'api/v1/services', $template);
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/services/1789764', $this->serviceTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $serviceId = factory(Service::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/services/' . $serviceId, [])->assertResponseStatus(422);
    }

    public function testInvalidNestedPut()
    {
        // can't update because parameters are invalid
        $serviceId = factory(Service::class)->create()->id;
        $template = $this->serviceTemplate();
        $template['service_rates'][2] = [
            'id' => 347859983,
            'rate_group_id' => factory(RateGroup::class)->create()->id,
            'rate_unit_id' => factory(RateUnit::class)->create()->id,
            'value' => 1337
        ];

        $this->asAdmin()->json('PUT', 'api/v1/services/' . $serviceId, $template)->assertResponseStatus(500);
    }

    public function testValidPut()
    {
        // also add one nested relation, delete one and update one
        $service = factory(Service::class)->create();
        $serviceRatesList = [factory(ServiceRate::class)->make([
            'rate_group_id' => factory(RateGroup::class)->create()->id,
            'rate_unit_id' => factory(RateUnit::class)->create()->id,
        ]), factory(ServiceRate::class)->make([
            'rate_group_id' => factory(RateGroup::class)->create()->id,
            'rate_unit_id' => factory(RateUnit::class)->create()->id,
        ])];
        $service->service_rates()->saveMany($serviceRatesList);

        $template = $this->serviceTemplate();
        $template['service_rates']['0']['id'] = $serviceRatesList[0]->id;

        $this->asAdmin()->json('PUT', 'api/v1/services/' . $service->id, $template);
        $this->assertResponseMatchesTemplate($template);
    }

    private function serviceTemplate()
    {
        return [
            'archived' => false,
            'description' => 'Verkürzen der Länge von Grashalmen auf Flächen.',
            'name' => 'Rasen Mähen',
            'vat' => 0.077,
            'service_rates' => [
                [
                    'rate_group_id' => factory(RateGroup::class)->create()->id,
                    'rate_unit_id' => factory(RateUnit::class)->create()->id,
                    'value' => 1337
                ], [
                    'rate_group_id' => factory(RateGroup::class)->create()->id,
                    'rate_unit_id' => factory(RateUnit::class)->create()->id,
                    'value' => 7331
                ]
            ]
        ];
    }
}
