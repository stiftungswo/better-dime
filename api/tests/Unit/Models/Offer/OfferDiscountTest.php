<?php

namespace Tests\Unit\Models\Offer;

use App\Models\Offer\Offer;
use App\Models\Offer\OfferDiscount;

class OfferDiscountTest extends \TestCase
{
    public function testOfferAssignment()
    {
        $offerDiscount = factory(OfferDiscount::class)->make();
        $offer = factory(Offer::class)->make();
        $offerDiscount->offer()->associate($offer);
        $this->assertEquals($offer, $offerDiscount->offer);
    }
}
