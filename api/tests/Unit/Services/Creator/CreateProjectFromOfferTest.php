<?php

namespace Tests\Unit\Services\Creator;

use App\Models\Offer\Offer;
use App\Services\Creator\CreateProjectFromOffer;
use InvalidArgumentException;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CreateProjectFromOfferTest extends \TestCase
{
    use DatabaseTransactions;

    public function testShouldApplyFixedPrice()
    {
        $offer = $this->offerTemplate();
        $offer->fixed_price = 900000;
        $offer->save();

        $creator = new CreateProjectFromOffer($offer);
        $project = $creator->create();
        $this->assertEquals(900000, $project->fixed_price);
    }

    public function testEmptyAccountant()
    {
        $this->expectOfferError('accountant_id');
    }

    public function testEmptyAddress()
    {
        $this->expectOfferError('address_id');
    }

    public function testEmptyShortDescription()
    {
        $this->expectOfferError('short_description');
    }

    public function testEmptyName()
    {
        $this->expectOfferError('name');
    }

    public function testEmptyRateGroup()
    {
        $this->expectOfferError('rate_group_id');
    }

    public function testEmptyServiceId()
    {
        $this->expectPositionError('service_id');
    }

    public function testEmptyPricePerRate()
    {
        $this->expectPositionError('price_per_rate');
    }

    public function testEmptyRateUnitId()
    {
        $this->expectPositionError('rate_unit_id');
    }

    public function testEmptyVat()
    {
        $this->expectPositionError('vat');
    }

    private function expectPositionError($a)
    {
        $offer = $this->offerTemplate();
        $offerPosition = $offer->positions->first();
        $offerPosition->$a = null;
        $offer->positions()->save($offerPosition);
        $this->setupAndCatchException($offer, $a);
    }


    private function expectOfferError($a)
    {
        $offer = $this->offerTemplate();
        $offer->$a = null;
        $offer->save();
        $this->setupAndCatchException($offer, $a);
    }

    private function setupAndCatchException($offer, $a)
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Cant create new entity because property ' . $a . ' is null.');
        $creator = new CreateProjectFromOffer($offer);
        $creator->create();
    }

    private function offerTemplate()
    {
        /** @var Offer $offer */
        $offer = factory(Offer::class)->create(
            [
                'accountant_id' => factory(\App\Models\Employee\Employee::class)->create()->id,
                'address_id' => factory(\App\Models\Customer\Address::class)->create()->id,
                'rate_group_id' => factory(\App\Models\Service\RateGroup::class)->create()->id,
            ]
        );

        $offer->positions()->saveMany(factory(\App\Models\Offer\OfferPosition::class, 2)->make([
            'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create()->id,
            'service_id' => factory(\App\Models\Service\Service::class)->create()->id,
        ]));

        return $offer;
    }
}
