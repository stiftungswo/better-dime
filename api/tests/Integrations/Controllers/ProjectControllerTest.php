<?php

namespace Tests\Integrations\Controllers;

use App\Models\Project\Project;
use App\Models\Project\ProjectPosition;
use App\Models\Service\RateUnit;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ProjectControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testArchive()
    {
        $project = factory(Project::class)->create([
            'archived' => false
        ]);
        $this->assertFalse($project->archived);
        $this->asAdmin()->json('PUT', 'api/v1/projects/' . $project->id . '/archive', [
            'archived' => true
        ])->assertResponseOk();
        $this->assertTrue($project->refresh()->archived);
    }

    public function testArchiveRestore()
    {
        $project = factory(Project::class)->create([
            'archived' => true
        ]);
        $this->assertTrue($project->archived);
        $this->asAdmin()->json('PUT', 'api/v1/projects/' . $project->id . '/archive', [
            'archived' => false
        ])->assertResponseOk();
        $this->assertFalse($project->refresh()->archived);
    }

    public function testInvalidIdDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/projects/1789764')->assertResponseStatus(404);
    }

    public function testNonDeletedProject()
    {
        $projectId = factory(Project::class)->create()->id;
        factory(\App\Models\Invoice\Invoice::class)->create([
            'project_id' => $projectId
        ]);
        $this->asAdmin()->json('DELETE', 'api/v1/projects/' . $projectId)->assertResponseStatus(422);
    }

    public function testValidDelete()
    {
        $projectId = factory(Project::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/projects/' . $projectId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testValidDuplicate()
    {
        $projectTemplate = factory(Project::class)->create();
        $projectTemplate->positions()->saveMany(factory(ProjectPosition::class, 5)->make());
        $this->asAdmin()->json('GET', 'api/v1/projects/' . $projectTemplate->id);
        $template = $this->responseToArray();

        $this->asAdmin()->json('POST', 'api/v1/projects/' . $projectTemplate->id . '/duplicate')->assertResponseOk();
        $this->assertResponseMatchesTemplate($template, true);
    }

    public function testGetIndex()
    {
        factory(Project::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/projects');
        $decodedResponse = $this->responseToArray();
        $this->assertEquals(count(Project::all()), count($decodedResponse));
    }

    public function testInvalidGet()
    {
        // can't get because object does not exist
        $this->asAdmin()->json('GET', 'api/v1/projects/1789764')->assertResponseStatus(404);
    }

    public function testValidGet()
    {
        $project = factory(Project::class)->create();
        $project->positions()->save(factory(ProjectPosition::class)->make());
        $this->asAdmin()->json('GET', 'api/v1/projects/' . $project->id);
        $decodedResponse = $this->responseToArray();

        $this->assertEquals($project->name, $decodedResponse['name']);
        $this->assertArrayHasKey('positions', $decodedResponse);
        $this->assertArrayHasKey('charge', $decodedResponse['positions'][0]);
        $this->assertArrayHasKey('calculated_vat', $decodedResponse['positions'][0]);
        $this->assertArrayHasKey('budget_price', $decodedResponse);
        $this->assertArrayHasKey('budget_time', $decodedResponse);
        $this->assertArrayHasKey('current_price', $decodedResponse);
        $this->assertArrayHasKey('current_time', $decodedResponse);
        $this->assertArrayHasKey('costgroup_distributions', $decodedResponse);
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/projects', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = $this->projectTemplate();
        $this->asAdmin()->json('POST', 'api/v1/projects', $template);
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/projects/1789764', $this->projectTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $projectId = factory(Project::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/projects/' . $projectId, [])->assertResponseStatus(422);
    }

    public function testInvalidNestedPut()
    {
        // can't update because parameters are invalid
        $projectId = factory(Project::class)->create()->id;
        $template = $this->projectTemplate();
        $template['positions'][2] = [
            'description' => 'Einsatzleiter',
            'id' => 5458937458372,
            'price_per_rate' => 9200,
            'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create()->id,
            'service_id' => factory(\App\Models\Service\Service::class)->create()->id,
            'vat' => '0.077'
        ];

        $this->asAdmin()->json('PUT', 'api/v1/projects/' . $projectId, $template)->assertResponseStatus(500);
    }

    public function testValidPut()
    {
        // also add one nested relation, delete one and update one
        $project = factory(Project::class)->create();
        $projectPositionList = factory(ProjectPosition::class)->times(2)->make();
        $project->positions()->saveMany($projectPositionList);

        $template = $this->projectTemplate();
        $template['positions']['0']['id'] = $projectPositionList[0]->id;

        $this->asAdmin()->json('PUT', 'api/v1/projects/' . $project->id, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvoiceIds()
    {
        $project = factory(Project::class)->create();
        $invoice1 = factory(\App\Models\Invoice\Invoice::class)->create(['project_id' => $project->id]);
        $invoice2 = factory(\App\Models\Invoice\Invoice::class)->create(['project_id' => $project->id]);

        $this->asUser()->json('GET', 'api/v1/projects/' . $project->id)->assertResponseOk();
        $res = $this->responseToArray();
        $this->assertContains($invoice1->id, $res['invoice_ids']);
        $this->assertContains($invoice2->id, $res['invoice_ids']);
    }

    public function testCostgroupsRequired()
    {
        $template = $this->projectTemplate();
        $template['costgroup_distributions'] = [];
        $this->asAdmin()->json('POST', 'api/v1/projects', $template)->assertResponseStatus(422);
    }

    public function testValidPrintEffortReport()
    {
        $project = factory(Project::class)->create();
        $rate_unit = factory(RateUnit::class)->create();
        $project->positions()->saveMany(factory(ProjectPosition::class, 5)->make([
            'project_id' => $project->id,
            'rate_unit_id' => $rate_unit->id
        ]));
        $project->positions()->each(function ($p) {
            $p->efforts()->saveMany(factory(\App\Models\Project\ProjectEffort::class, 5)->make());
        });
        $project->comments()->saveMany(factory(\App\Models\Project\ProjectComment::class, 5)->make());

        $this->asAdmin()->json('GET', 'api/v1/projects/' . $project->id . '/print_effort_report')->assertResponseOk();
    }

    public function testPrintEffortReportForInvoiceWithoutProject()
    {
        $this->asAdmin()->json('GET', 'api/v1/projects/3284092384092038/print_effort_report')->assertResponseStatus(404);
    }

    private function projectTemplate()
    {
        return [
            'accountant_id' => factory(\App\Models\Employee\Employee::class)->create()->id,
            'address_id' => factory(\App\Models\Customer\Address::class)->create()->id,
            'archived' => false,
            'category_id' => factory(\App\Models\Project\ProjectCategory::class)->create()->id,
            'chargeable' => true,
            'costgroup_distributions' => [
                [
                    'costgroup_number' => factory(\App\Models\Costgroup\Costgroup::class)->create()->number,
                    'weight' => 80
                ],
                [
                    'costgroup_number' => factory(\App\Models\Costgroup\Costgroup::class)->create()->number,
                    'weight' => 20
                ]
            ],
            'deadline' => '2019-12-31',
            'description' => 'Die Meier / Tobler wünscht eine Neuanpflanzung ihrer steriler Wiese vor dem Hauptgebäude. Durch die Neuanpflanzung soll über die nächsten drei Jahre eine ökologisch hochwertige Fläche entstehen, welche als Heimat für eine Vielzahl von Tieren und Pflanzen diesen soll.',
            'fixed_price' => 5678420,
            'vacation_project' => false,
            'name' => 'Neuanpflanzung Meier / Tobler 2018 / 2019',
            'offer_id' => factory(\App\Models\Offer\Offer::class)->create()->id,
            'positions' => [
                [
                    'description' => 'Einsatzleiter',
                    'price_per_rate' => 9200,
                    'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create()->id,
                    'service_id' => factory(\App\Models\Service\Service::class)->create()->id,
                    'vat' => '0.077'
                ], [
                    'description' => 'Direktbegrünung',
                    'price_per_rate' => 250,
                    'rate_unit_id' => factory(\App\Models\Service\RateUnit::class)->create()->id,
                    'service_id' => factory(\App\Models\Service\Service::class)->create()->id,
                    'vat' => '0.025'
                ],
            ],
            'rate_group_id' => factory(\App\Models\Service\RateGroup::class)->create()->id,
        ];
    }
}
