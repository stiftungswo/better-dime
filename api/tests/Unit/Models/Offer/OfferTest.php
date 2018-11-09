<?php

namespace Tests\Unit\Models\Offer;

use App\Models\Customer\Address;
use App\Models\Customer\Person;
use App\Models\Employee\Employee;
use App\Models\Offer\Offer;
use App\Models\Service\RateGroup;
use Laravel\Lumen\Testing\DatabaseTransactions;

class OfferTest extends \TestCase
{

    use DatabaseTransactions;

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

    public function testNullProjectIdAttribute()
    {
        $this->assertNull(factory(Offer::class)->make()->project_id);
    }

    public function testPopulatedProjectIdAttribute()
    {
        $offer = factory(Offer::class)->create();
        $project = factory(\App\Models\Project\Project::class)->create([
            'offer_id' => $offer->id
        ]);

        $this->assertEquals($project->id, $offer->fresh(['project'])->project_id);
    }

    public function testEmptyInvoiceIdsAttribute()
    {
        $this->assertEmpty(factory(Offer::class)->make()->invoice_ids);
    }

    public function testPopulatedInvoiceIdsAttribute()
    {
        $offer = factory(Offer::class)->create();
        $project = factory(\App\Models\Project\Project::class)->create([
            'offer_id' => $offer->id
        ]);
        $invoice_ids = factory(\App\Models\Invoice\Invoice::class, 2)->create([
            'project_id' => $project->id
        ])->map(function ($i) {
            return $i->id;
        });

        $this->assertEquals($invoice_ids, $offer->fresh()->invoice_ids);
    }
}
