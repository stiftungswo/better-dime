<?php

namespace Tests\Integrations\Controllers;

use App\Models\Offer\Offer;
use App\Models\Offer\OfferDiscount;
use App\Models\Offer\OfferPosition;
use Laravel\Lumen\Testing\DatabaseTransactions;

class OfferControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/offers/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $offerId = factory(Offer::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/offers/' . $offerId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testIndex()
    {
        factory(Offer::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/offers');
        $decodedResponse = $this->responseToArray();
        $this->assertCount(count(Offer::all()), $decodedResponse);
    }

    public function testInvalidGet()
    {
        // can't get because object does not exist
        $this->asAdmin()->json('GET', 'api/v1/offers/1789764')->assertResponseStatus(404);
    }

    public function testValidGet()
    {
        $offer = factory(Offer::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/offers/' . $offer->id)->assertResponseOk();

        // answer should also include discounts and positions
        $decodedResponse = $this->responseToArray();
        $this->assertEquals($offer->description, $decodedResponse['description']);
        $this->assertArrayHasKey('discounts', $decodedResponse);
        $this->assertArrayHasKey('positions', $decodedResponse);
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/offers', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = $this->offerTemplate();
        $this->asAdmin()->json('POST', 'api/v1/offers', $template);
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/offers/1789764', $this->offerTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $offerId = factory(Offer::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/offers/' . $offerId, [])->assertResponseStatus(422);
    }

    public function testInvalidNestedPut()
    {
        // can't update because parameters are invalid
        $offerId = factory(Offer::class)->create()->id;
        $template = $this->offerTemplate();
        $template['positions'][2] = [
            'amount' => 30,
            'id' => 347859983,
            'order' => 1,
            'price_per_rate' => 500,
            'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create()->id,
            'service_id' => factory(\App\Models\Service\Service::class)->create()->id,
            'vat' => '0.025'
        ];

        $this->asAdmin()->json('PUT', 'api/v1/offers/' . $offerId, $template)->assertResponseStatus(500);
    }

    public function testValidPut()
    {
        // also add one nested relation, delete one and update one
        $offer = factory(Offer::class)->create();
        $offerDiscountList = factory(OfferDiscount::class)->times(2)->make();
        $offerPositionList = factory(OfferPosition::class)->times(2)->make();
        $offer->discounts()->saveMany($offerDiscountList);
        $offer->positions()->saveMany($offerPositionList);

        $template = $this->offerTemplate();
        $template['discounts']['0']['id'] = $offerDiscountList[0]->id;
        $template['positions']['0']['id'] = $offerPositionList[0]->id;

        $this->asAdmin()->json('PUT', 'api/v1/offers/' . $offer->id, $template);
        $this->assertResponseMatchesTemplate($template);
    }

    public function testValidPrint()
    {
        $offer = factory(\App\Models\Offer\Offer::class)->create([
            'accountant_id' => factory(\App\Models\Employee\Employee::class)->create()->id,
            'address_id' => factory(\App\Models\Customer\Address::class)->create()->id,
            'rate_group_id' => factory(\App\Models\Service\RateGroup::class)->create()->id,
        ]);
        $offer->positions()->saveMany(factory(\App\Models\Offer\OfferPosition::class)->times(rand(0, 5))->make());
        $offer->discounts()->saveMany(factory(\App\Models\Offer\OfferDiscount::class)->times(rand(0, 5))->make());
        $this->asAdmin()->json('GET', 'api/v1/offers/' . $offer->id . '/print')->assertResponseOk();
    }

    public function testValidCreateProject()
    {
        $template = $this->offerTemplate();
        $this->asAdmin()->json('POST', 'api/v1/offers', $template);
        $id = $this->responseToArray()['id'];
        $this->asAdmin()->json('POST', 'api/v1/offers/' . $id . '/create_project')->assertResponseOk();
    }

    private function offerTemplate()
    {
        return [
            'accountant_id' => factory(\App\Models\Employee\Employee::class)->create()->id,
            'address_id' => factory(\App\Models\Customer\Address::class)->create()->id,
            'description' => 'Die Meier / Tobler wünscht eine Neuanpflanzung ihrer steriler Wiese vor dem Hauptgebäude. Durch die Neuanpflanzung soll über die nächsten drei Jahre eine ökologisch hochwertige Fläche entstehen, welche als Heimat für eine Vielzahl von Tieren und Pflanzen diesen soll.',
            'discounts' => [
                [
                    'name' => 'Nachbarschaftsrabatt',
                    'percentage' => false,
                    'value' => 50000
                ], [
                    'name' => 'Haustechnikrabatt',
                    'percentage' => true,
                    'value' => 0.1
                ]
            ],
            'name' => 'Neuanpflanzung Firmenwiese Meier / Tobler 2019',
            'positions' => [
                [
                    'amount' => 30,
                    'order' => 1,
                    'price_per_rate' => 500,
                    'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create()->id,
                    'service_id' => factory(\App\Models\Service\Service::class)->create()->id,
                    'vat' => '0.025'
                ], [
                    'amount' => 10,
                    'order' => 2,
                    'price_per_rate' => 8500,
                    'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create()->id,
                    'service_id' => factory(\App\Models\Service\Service::class)->create()->id,
                    'vat' => '0.077'
                ],
            ],
            'rate_group_id' => factory(\App\Models\Service\RateGroup::class)->create()->id,
            'short_description' => 'Neuanpflanzung Firmenwiese Meier / Tobler',
            'status' => 2
        ];
    }
}
