<?php

namespace Tests\Unit\Models\Offer;

use App\Models\Customer\Address;
use App\Models\Customer\Person;
use App\Models\Employee\Employee;
use App\Models\Offer\Offer;
use App\Models\Service\RateGroup;

class OfferTest extends \TestCase
{

    public function testAccountantAssignment()
    {
        $accountant = factory(Employee::class)->make();
        $offer = factory(Offer::class)->make();
        $offer->accountant()->associate($accountant);
        $this->assertEquals($accountant, $offer->accountant);
    }

    public function testAddressAssignment()
    {
        $address = factory(Address::class)->make();
        $offer = factory(Offer::class)->make();
        $offer->address()->associate($address);
        $this->assertEquals($address, $offer->address);
    }

    public function testRateGroupAssignment()
    {
        $rateGroup = factory(RateGroup::class)->make();
        $offer = factory(Offer::class)->make();
        $offer->rate_group()->associate($rateGroup);
        $this->assertEquals($rateGroup, $offer->rate_group);
    }
}
