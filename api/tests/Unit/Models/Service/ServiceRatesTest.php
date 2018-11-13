<?php

namespace Tests\Unit\Services;

use App\Models\Service\RateGroup;
use App\Models\Service\RateUnit;
use App\Models\Service\Service;
use App\Models\Service\ServiceRate;

class ServiceRatesTest extends \TestCase
{
    public function testRateGroupAssignment()
    {
        $rateGroup = factory(RateGroup::class)->make();
        $serviceRate = factory(ServiceRate::class)->make();
        $serviceRate->rate_group()->associate($rateGroup);
        $this->assertEquals($rateGroup, $serviceRate->rate_group);
    }

    public function testServiceAssignment()
    {
        $service = factory(Service::class)->make();
        $serviceRate = factory(ServiceRate::class)->make();
        $serviceRate->service()->associate($service);
        $this->assertEquals($service, $serviceRate->service);
    }

    public function testRateUnitAssignment()
    {
        $rateUnit = factory(RateUnit::class)->make();
        $serviceRate = factory(ServiceRate::class)->make();
        $serviceRate->rate_unit()->associate($rateUnit);
        $this->assertEquals($rateUnit, $serviceRate->rate_unit);
    }
}
