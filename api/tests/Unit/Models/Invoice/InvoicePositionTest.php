<?php

namespace Tests\Unit\Models\Invoice;

use App\Models\Invoice\Invoice;
use App\Models\Invoice\InvoicePosition;
use App\Models\PositionGroup\PositionGroup;
use App\Models\Project\ProjectPosition;
use App\Models\Service\RateUnit;
use Laravel\Lumen\Testing\DatabaseTransactions;

class InvoicePositionTest extends \TestCase
{
    use DatabaseTransactions;

    public function testInvoiceAssignment()
    {
        $invoicePosition = factory(InvoicePosition::class)->make();
        $invoice = factory(Invoice::class)->make();
        $invoicePosition->invoice()->associate($invoice);
        $this->assertEquals($invoice, $invoicePosition->invoice);
    }

    public function testRateUnitAssignment()
    {
        $invoicePosition = factory(InvoicePosition::class)->make();
        $rateUnit = factory(RateUnit::class)->make();
        $invoicePosition->rate_unit()->associate($rateUnit);
        $this->assertEquals($rateUnit, $invoicePosition->rate_unit);
    }

    public function testProjectPositionAssignment()
    {
        $invoicePosition = factory(InvoicePosition::class)->make();
        $projectPosition = factory(ProjectPosition::class)->make();
        $invoicePosition->project_position()->associate($projectPosition);
        $this->assertEquals($projectPosition, $invoicePosition->project_position);
    }

    public function testPositionGroupAssignment()
    {
        $positionGroup = factory(PositionGroup::class)->make();
        $invoicePosition = factory(InvoicePosition::class)->make();
        $invoicePosition->position_group()->associate($positionGroup);
        $this->assertEquals($positionGroup, $invoicePosition->position_group);
    }

    public function testValidCalculatedTotal()
    {
        $invoicePosition = factory(InvoicePosition::class)->make();
        $this->assertEquals($invoicePosition->price_per_rate * $invoicePosition->amount, $invoicePosition->calculated_total);
    }

    public function testInvalidCalculatedTotal()
    {
        $invoicePosition = factory(InvoicePosition::class)->make();
        $invoicePosition->price_per_rate = '???';
        $invoicePosition->amount = 12;
        $this->assertEquals(0, $invoicePosition->calculated_total);

        $invoicePosition->price_per_rate = 12000;
        $invoicePosition->amount = '???';
        $this->assertEquals(0, $invoicePosition->calculated_total);
    }
}
