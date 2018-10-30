<?php

namespace Tests\Unit\Models\Project;

use App\Models\Project\Project;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;
use App\Models\Service\RateUnit;
use App\Models\Service\Service;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ProjectPositionTest extends \TestCase
{
    use DatabaseTransactions;

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

    public function testGetChargeAttribute()
    {
        // should be 0 if position has no efforts
        /** @var ProjectPosition $position */
        $position = factory(ProjectPosition::class)->create([
            'price_per_rate' => 7500,
            'vat' => 0.077
        ]);
        $this->assertEquals(0, $position->charge);

        // should be more with more positions
        $position->efforts()->save(factory(ProjectEffort::class)->make([
            'value' => 70
        ]));
        $position->efforts()->save(factory(ProjectEffort::class)->make([
            'value' => 140
        ]));

        $this->assertEquals(1696275, $position->fresh()->charge);
    }

    public function testGetCalculatedVatAttribute()
    {
        /** @var ProjectPosition $position */
        $position = factory(ProjectPosition::class)->create([
            'price_per_rate' => 9000,
            'vat' => 0.077
        ]);
        // should be 0 if no efforts are recorded for the position
        $this->assertEquals(0, $position->calculated_vat);

        $position->efforts()->saveMany(factory(ProjectEffort::class, 2)->make([
            'value' => 50
        ]));

        $this->assertEquals(69300, $position->fresh(['efforts'])->calculated_vat);
    }

    public function testEffortsValueSum()
    {
        // should be 0 if no efforts are recorded for the position
        /** @var ProjectPosition $position */
        $position = factory(ProjectPosition::class)->create();
        $this->assertEquals(0, $position->effortsValueSum());

        $position->efforts()->saveMany(factory(ProjectEffort::class, 2)->make([
            'value' => 1234.56
        ]));

        $this->assertEquals(2469.12, $position->fresh(['efforts'])->effortsValueSum());
    }
}
