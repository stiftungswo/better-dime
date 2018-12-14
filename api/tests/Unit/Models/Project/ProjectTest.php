<?php

namespace Tests\Unit\Models\Project;

use App\Models\Customer\Address;
use App\Models\Employee\Employee;
use App\Models\Costgroup\Costgroup;
use App\Models\Offer\Offer;
use App\Models\Project\Project;
use App\Models\Project\ProjectCategory;
use App\Models\Project\ProjectCostgroupDistribution;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;
use App\Models\Service\RateGroup;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ProjectTest extends \TestCase
{

    use DatabaseTransactions;

    public function testAccountantAssignment()
    {
        $accountant = factory(Employee::class)->make();
        $project = factory(Project::class)->make();
        $project->accountant()->associate($accountant);
        $this->assertEquals($accountant, $project->accountant);
    }

    public function testAddressAssignment()
    {
        $address = factory(Address::class)->make();
        $project = factory(Project::class)->make();
        $project->address()->associate($address);
        $this->assertEquals($address, $project->address);
    }

    public function testProjectCategoryAssignment()
    {
        $category = factory(ProjectCategory::class)->make();
        $project = factory(Project::class)->make();
        $project->category()->associate($category);
        $this->assertEquals($category, $project->category);
    }

    public function testOfferAssignment()
    {
        $offer = factory(Offer::class)->make();
        $project = factory(Project::class)->make();
        $project->offer()->associate($offer);
        $this->assertEquals($offer, $project->offer);
    }

    public function testRateGroupAssignment()
    {
        $rateGroup = factory(RateGroup::class)->make();
        $project = factory(Project::class)->make();
        $project->rate_group()->associate($rateGroup);
        $this->assertEquals($rateGroup, $project->rate_group);
    }

    public function testBudgetPriceWithoutOffer()
    {
        $this->assertNull(factory(Project::class)->create([
            'offer_id' => null
        ])->budget_price);
    }

    public function testBudgetPriceWithOfferFixedPrice()
    {
        $offer = factory(Offer::class)->create([
            'fixed_price' => 13377337
        ]);
        $project = factory(Project::class)->create([
            'offer_id' => $offer->id
        ]);
        $this->assertEquals(13377337, $project->budget_price);
    }

    public function testBudgetPriceCalculation()
    {
        $offer = factory(Offer::class)->create([
            'fixed_price' => null
        ]);
        $offer->positions()->saveMany(factory(\App\Models\Offer\OfferPosition::class, 2)->make([
            'amount' => 1337,
            'price_per_rate' => 50,
            'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create([
                'factor' => 1,
                'is_time' => true
            ])->id,
        ]));
        $offer->positions()->saveMany(factory(\App\Models\Offer\OfferPosition::class, 2)->make([
            'amount' => 1337,
            'price_per_rate' => 50,
            'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create([
                'factor' => 1,
                'is_time' => false
            ])->id,
        ]));

        $project = factory(Project::class)->create([
            'offer_id' => $offer->id
        ]);

        $this->assertEquals(50 * 1337 * 4, $project->budget_price);
    }

    public function testBudgetTimeWithoutOffer()
    {
        $this->assertNull(factory(Project::class)->create([
            'offer_id' => null
        ])->budget_time);
    }

    public function testBudgetTime()
    {
        $offer = factory(Offer::class)->create();
        $offer->positions()->saveMany(factory(\App\Models\Offer\OfferPosition::class, 2)->make([
            'amount' => 1337,
            'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create([
                'factor' => 1,
                'is_time' => true
            ])->id,
        ]));
        $offer->positions()->saveMany(factory(\App\Models\Offer\OfferPosition::class, 2)->make([
            'amount' => 1337,
            'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create([
                'factor' => 1,
                'is_time' => false
            ])->id,
        ]));

        $project = factory(Project::class)->create([
            'offer_id' => $offer->id
        ]);

        $this->assertEquals(2674, $project->budget_time);
    }

    public function testGetCurrentPriceAttribute()
    {
        $project = factory(Project::class)->create();
        $rateUnit = factory(\App\Models\Service\RateUnit::class)->create([
            'factor' => 5
        ]);
        $project->positions()->saveMany(factory(ProjectPosition::class, 2)->make([
            'price_per_rate' => 12000,
            'rate_unit_id' => $rateUnit->id,
            'vat' => 0.077
        ]));
        $project->positions->each(function ($pp) {
            $pp->efforts()->save(factory(ProjectEffort::class)->make([
                'value' => 504
            ]));
        });

        $calc = 2 * (504 / 5 * 12000 + 504 / 5 * 12000 * 0.077);
        $this->assertEquals($calc, $project->fresh()->current_price);
    }

    public function testGetCurrentTimeAttribute()
    {
        $project = factory(Project::class)->create();
        $rateUnitTime = factory(\App\Models\Service\RateUnit::class)->create(['is_time' => true, 'factor' => 1]);
        $rateUnitMaterial = factory(\App\Models\Service\RateUnit::class)->create(['is_time' => false]);

        // add a few positions with time, and another one with a non-time rate unit
        $project->positions()->saveMany(factory(ProjectPosition::class, 2)->make([
            'rate_unit_id' => $rateUnitTime->id,
            'price_per_rate' => 8000,
            'vat' => 0.025
        ]));

        $project->positions()->saveMany(factory(ProjectPosition::class, 2)->make([
            'rate_unit_id' => $rateUnitMaterial->id,
            'price_per_rate' => 8000,
            'vat' => 0.025
        ]));

        $project->positions->each(function ($pp) {
            $pp->efforts()->save(factory(ProjectEffort::class)->make([
                'value' => 504
            ]));
        });

        $calc = 2 * 504;
        $this->assertEquals($calc, $project->fresh()->current_time);
    }

    public function testDeletableAttributeWithEfforts()
    {
        $project = factory(Project::class)->create();
        $position = factory(ProjectPosition::class)->create([
            'project_id' => $project->id
        ]);
        factory(ProjectEffort::class)->create([
            'position_id' => $position->id
        ]);

        $this->assertFalse($project->refresh()->deletable);
    }

    public function testDeletableAttributeWithAnInvoice()
    {
        $project = factory(Project::class)->create();
        factory(\App\Models\Invoice\Invoice::class)->create([
            'project_id' => $project->id
        ]);

        $this->assertFalse($project->refresh()->deletable);
    }

    public function testDeletableAttributeWithNothing()
    {
        $project = factory(Project::class)->create();
        $this->assertTrue($project->refresh()->deletable);
    }

    public function testEmptyDistributionOfCostgroup()
    {
        $project = factory(Project::class)->create();
        $this->assertEmpty($project->distribution_of_costgroups);
    }

    public function testPopulatedDistributionOfCostgroup()
    {
        $project = factory(Project::class)->create();
        $costgroup1 = factory(Costgroup::class)->create();
        $costgroup2 = factory(Costgroup::class)->create();
        factory(ProjectCostgroupDistribution::class)->create([
            'project_id' => $project->id,
            'costgroup_number' => $costgroup1->number,
            'weight' => 60
        ]);
        factory(ProjectCostgroupDistribution::class)->create([
            'project_id' => $project->id,
            'costgroup_number' => $costgroup2->number,
            'weight' => 40
        ]);

        $this->assertContains([
            'costgroup_number' => $costgroup1->number,
            'ratio' => 60
        ], $project->distribution_of_costgroups);
        $this->assertContains([
            'costgroup_number' => $costgroup2->number,
            'ratio' => 40
        ], $project->distribution_of_costgroups);
    }
}
