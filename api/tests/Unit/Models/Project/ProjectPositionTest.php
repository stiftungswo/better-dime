<?php

namespace Tests\Unit\Models\Project;

use App\Models\Project\Project;
use App\Models\Project\ProjectPosition;
use App\Models\Service\RateUnit;
use App\Models\Service\Service;

class ProjectPositionTest extends \TestCase
{
    public function testProjectAssignment()
    {
        $project = factory(Project::class)->make();
        $position = factory(ProjectPosition::class)->make();
        $position->project()->associate($project);
        $this->assertEquals($project, $position->project);
    }

    public function testRateUnitAssignment()
    {
        $rateUnit = factory(RateUnit::class)->make();
        $position = factory(ProjectPosition::class)->make();
        $position->rate_unit()->associate($rateUnit);
        $this->assertEquals($rateUnit, $position->rate_unit);
    }

    public function testServiceAssignment()
    {
        $service = factory(Service::class)->make();
        $position = factory(ProjectPosition::class)->make();
        $position->service()->associate($service);
        $this->assertEquals($service, $position->service);
    }
}
