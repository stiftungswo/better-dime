<?php

namespace Tests\Unit\Models\Invoice;

use App\Models\Invoice\Costgroup;
use App\Models\Invoice\CostgroupDistribution;
use App\Models\Invoice\Invoice;

class CostgroupDistributionTest extends \TestCase
{
    public function testInvoiceAssignment()
    {
        $invoice = factory(Invoice::class)->make();
        $costgroupDistribution = factory(CostgroupDistribution::class)->make();
        $costgroupDistribution->invoice()->associate($invoice);
        $this->assertEquals($invoice, $costgroupDistribution->invoice);
    }

    public function testCostgroupAssignment()
    {
        $costgroup = factory(Costgroup::class)->make();
        $costgroupDistribution = factory(CostgroupDistribution::class)->make();
        $costgroupDistribution->costgroup()->associate($costgroup);
        $this->assertEquals($costgroup, $costgroupDistribution->costgroup);
    }
}
