<?php

namespace Tests\Unit\Models\Project;

use App\Models\Customer\Address;
use App\Models\Employee\Employee;
use App\Models\Offer\Offer;
use App\Models\Project\Project;
use App\Models\Project\ProjectCategory;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;
use App\Models\Service\RateGroup;
use App\Models\Service\RateUnit;
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

    public function testGetCurrentPriceAttribute()
    {
        $project = factory(Project::class)->create();
        $project->positions()->saveMany(factory(ProjectPosition::class, 2)->make([
            'price_per_rate' => 12000,
            'vat' => 0.077
        ]));
        $project->positions->each(function ($pp) {
            $pp->efforts()->save(factory(ProjectEffort::class)->make([
                'value' => 504
            ]));
        });

        $calc = 2 * (504 * 12000 + 504 * 12000 * 0.077);
        $this->assertEquals($calc, $project->fresh()->current_price);
    }

    public function testGetCurrentTimeAttribute()
    {
        $project = factory(Project::class)->create();
        $rateUnitTime = factory(RateUnit::class)->create(['is_time' => true, 'factor' => 1]);
        $rateUnitMaterial = factory(RateUnit::class)->create(['is_time' => false]);

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
}