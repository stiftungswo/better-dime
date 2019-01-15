<?php

namespace Tests\Integrations\Controllers;

use App\Models\Project\ProjectEffort;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ReportControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testExportServiceHoursWithInvalidParams()
    {
        $this->asAdmin()->json('GET', 'api/v1/reports/service_hours', [
            'start' => 'jabdudiiibi'
        ])->assertResponseStatus(422);
    }

    public function testExportServiceHoursPerProjectWithValidParams()
    {
        // seed a few things to have something in the report
        factory(ProjectEffort::class, 30)->create();
        $this->asAdmin()->json('GET', 'api/v1/reports/service_hours', [
            'end' => '2050-12-31',
            'group_by' => 'project',
            'start' => '2000-01-01'
        ])->assertResponseOk();
    }

    public function testExportServiceHoursPerCategoryWithValidParams()
    {
        // seed a few things to have something in the report
        factory(ProjectEffort::class, 30)->create();
        $this->asAdmin()->json('GET', 'api/v1/reports/service_hours', [
            'end' => '2050-12-31',
            'group_by' => 'category',
            'start' => '2000-01-01'
        ])->assertResponseOk();
    }
}
