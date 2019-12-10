<?php

namespace Tests\Unit\Models\Invoice;

use App\Models\Costgroup\Costgroup;
use App\Models\Invoice\InvoiceCostgroupDistribution;
use App\Models\Invoice\Invoice;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CostgroupDistributionTest extends \TestCase
{
    use DatabaseTransactions;

    public function testInvoiceAssignment()
    {
        $invoice = factory(Invoice::class)->make();
        $costgroupDistribution = factory(InvoiceCostgroupDistribution::class)->make();
        $costgroupDistribution->invoice()->associate($invoice);
        $this->assertEquals($invoice, $costgroupDistribution->invoice);
    }

    public function testCostgroupAssignment()
    {
        $costgroup = factory(Costgroup::class)->make();
        $costgroupDistribution = factory(InvoiceCostgroupDistribution::class)->make();
        $costgroupDistribution->costgroup()->associate($costgroup);
        $this->assertEquals($costgroup, $costgroupDistribution->costgroup);
    }
}
