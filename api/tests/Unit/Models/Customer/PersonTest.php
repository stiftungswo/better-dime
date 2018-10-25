<?php

namespace Tests\Unit\Models\Customer;

use App\Models\Customer\Company;
use App\Models\Customer\CustomerTag;
use App\Models\Customer\Person;
use App\Models\Service\RateGroup;
use Laravel\Lumen\Testing\DatabaseTransactions;

class PersonTest extends \TestCase
{
    use DatabaseTransactions;

    public function testGetEmptyTagAttribute()
    {
        // should return empty array if no tags are assigned
        $person = factory(Person::class)->create();
        $this->assertEmpty($person->tags);
    }

    public function testGetPopulatedTagAttribute()
    {
        $person = factory(Person::class)->create();
        $person->customer_tags()->saveMany(factory(CustomerTag::class)->times(5)->make());
        $this->assertCount(5, $person->tags);
    }

    public function testRateGroupAssignment()
    {
        $rateGroup = factory(RateGroup::class)->create();
        $person = factory(Person::class)->create();
        $person->rateGroup()->associate($rateGroup);
        $person->save();
        $this->assertEquals($rateGroup, $person->rateGroup);
    }

    public function testCompanyAssignment()
    {
        $company = factory(Company::class)->create();
        $person = factory(Person::class)->create();
        $person->company()->associate($company);
        $person->save();
        $this->assertEquals($company, $person->company);
    }
}
