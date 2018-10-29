<?php

namespace Tests\Unit\Models\Project;

use App\Models\Customer\Address;
use App\Models\Employee\Employee;
use App\Models\Offer\Offer;
use App\Models\Project\Project;
use App\Models\Project\ProjectCategory;
use App\Models\Service\RateGroup;

class ProjectTest extends \TestCase
{

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
}
