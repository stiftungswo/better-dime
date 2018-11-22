<?php

namespace Tests\Integrations\Controllers;

use Laravel\Lumen\Testing\DatabaseTransactions;

class ReportControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testValidPrintEffortReport()
    {
        $project = factory(\App\Models\Project\Project::class)->create();
        $rate_unit = factory(\App\Models\Service\RateUnit::class)->create();
        $project->positions()->saveMany(factory(\App\Models\Project\ProjectPosition::class, 5)->make([
            'project_id' => $project->id,
            'rate_unit_id' => $rate_unit->id
        ]));
        $project->positions()->each(function ($p) {
            $p->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 5)->make());
        });
        $project->comments()->saveMany(factory(\App\Models\Project\ProjectComment::class, 5)->make());
        $creator = new \App\Services\Creator\CreateInvoiceFromProject($project);
        $invoice = $creator->create();

        $this->asAdmin()->json('GET', 'api/v1/invoices/' . $invoice->id . '/print_effort_report')->assertResponseOk();
    }

    public function testPrintEffortReportForInvoiceWithoutProject()
    {
        $invoice = factory(\App\Models\Invoice\Invoice::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/invoices/' . $invoice->id . '/print_effort_report')->assertResponseStatus(400);
        $this->assertEquals('Invoice ' . $invoice->id . ' has no project assigned!', $this->response->getContent());
    }
}
