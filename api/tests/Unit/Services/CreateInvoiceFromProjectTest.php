<?php

namespace Tests\Unit\Services;

use App\Models\Invoice\Invoice;
use App\Models\Offer\Offer;
use App\Models\Offer\OfferDiscount;
use App\Models\Project\Project;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;
use App\Models\Service\RateUnit;
use App\Services\CreateInvoiceFromProject;
use Carbon\Carbon;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CreateInvoiceFromProjectTest extends \TestCase
{
    use DatabaseTransactions;

    public function testTimespanWithOneInvoice()
    {
        $project = factory(Project::class)->create();
        $project_position = factory(ProjectPosition::class)->create(['project_id' => $project->id]);
        $project_effort = factory(ProjectEffort::class)->create([
            'position_id' => $project_position->id,
            'date' => '2001-01-01'
        ]);

        $creator = new CreateInvoiceFromProject($project);
        $invoice = $creator->create();
        $this->assertEquals($project_effort->date, $invoice->start);
    }

    public function testTimespanWithExistingInvoiceAndEfforts()
    {
        $project = factory(Project::class)->create();
        $project_position = factory(ProjectPosition::class)->create(['project_id' => $project->id]);
        $project_effort = factory(ProjectEffort::class)->create([
            'position_id' => $project_position->id,
            'date' => '2011-11-01'
        ]);
        $oldInvoice = factory(Invoice::class)->create([
            'end' => '2010-02-01',
            'project_id' => $project->id
        ]);

        $creator = new CreateInvoiceFromProject($project);
        $invoice = $creator->create();
        $this->assertEquals(Carbon::parse($oldInvoice->end)->addDay()->format('Y-m-d'), $invoice->start);
        $this->assertEquals($project_effort->date, $invoice->end);
    }

    public function testDiscountShouldBeAdded()
    {
        $offer = factory(Offer::class)->create();
        $offer_discount = factory(OfferDiscount::class)->create([
            'offer_id' => $offer->id
        ]);
        $project = factory(Project::class)->create([
            'offer_id' => $offer->id
        ]);

        $creator = new CreateInvoiceFromProject($project);
        $invoice = $creator->create();
        $this->assertCount(1, $invoice->discounts);
        $invoice_discount = $invoice->discounts->first();

        // check that the attributes were copied directly
        $this->assertEquals($offer_discount->percentage, $invoice_discount->percentage);
        $this->assertEquals($offer_discount->value, $invoice_discount->value);
        $this->assertEquals($offer_discount->name, $invoice_discount->name);
    }

    public function testPositionsShouldBeAdded()
    {
        $project = factory(Project::class)->create();
        $rateUnitId = factory(RateUnit::class)->create()->id;

        $project_position = factory(ProjectPosition::class)->create([
            'rate_unit_id' => $rateUnitId,
            'project_id' => $project->id
        ]);

        $creator = new CreateInvoiceFromProject($project);
        $invoice = $creator->create();
        $this->assertCount(1, $invoice->positions);
        $invoice_position = $invoice->positions->first();

        $this->assertEquals($project_position->description, $invoice_position->description);
        $this->assertEquals($project_position->rate_unit, $invoice_position->rate_unit);
        $this->assertEquals($project_position->price_per_rate, $invoice_position->price_per_rate);
        $this->assertEquals($project_position->vat, $invoice_position->vat);
        $this->assertEquals($project_position->id, $invoice_position->project_position->id);
    }
}
