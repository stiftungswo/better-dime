<?php

namespace Tests\Unit\Models\Offer;

use App\Models\Offer\Offer;
use App\Models\Offer\OfferPosition;
use App\Models\PositionGroup\PositionGroup;
use App\Models\Service\RateUnit;
use App\Models\Service\Service;
use Laravel\Lumen\Testing\DatabaseTransactions;

class OfferPositionTest extends \TestCase
{
    use DatabaseTransactions;

    public function testOfferAssignment()
    {
        $offerPosition = factory(OfferPosition::class)->make();
        $offer = factory(Offer::class)->make();
        $offerPosition->offer()->associate($offer);
        $this->assertEquals($offer, $offerPosition->offer);
    }

    public function testRateUnitAssignment()
    {
        $offerPosition = factory(OfferPosition::class)->make();
        $rateUnit = factory(RateUnit::class)->make();
        $offerPosition->rate_unit()->associate($rateUnit);
        $this->assertEquals($rateUnit, $offerPosition->rate_unit);
    }

    public function testServiceAssignment()
    {
        $offerPosition = factory(OfferPosition::class)->make();
        $service = factory(Service::class)->make();
        $offerPosition->service()->associate($service);
        $this->assertEquals($service, $offerPosition->service);
    }

    public function testPositionGroupAssignment()
    {
        $positionGroup = factory(PositionGroup::class)->make();
        $offerPosition = factory(OfferPosition::class)->make();
        $offerPosition->position_group()->associate($positionGroup);
        $this->assertEquals($positionGroup, $offerPosition->position_group);
    }

    public function testValidCalculatedTotal()
    {
        $offerPosition = factory(OfferPosition::class)->make();
        $this->assertEquals($offerPosition->price_per_rate * $offerPosition->amount, $offerPosition->calculated_total);
    }

    public function testInvalidCalculatedTotal()
    {
        $offerPosition = factory(OfferPosition::class)->make();
        $offerPosition->price_per_rate = '???';
        $offerPosition->amount = 12;
        $this->assertEquals(0, $offerPosition->calculated_total);

        $offerPosition->price_per_rate = 12000;
        $offerPosition->amount = '???';
        $this->assertEquals(0, $offerPosition->calculated_total);
    }
}
