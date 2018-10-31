<?php

namespace Tests\Integrations\Controllers;

use App\Models\Project\Project;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ProjectEffortControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/project_efforts/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $effortId = factory(ProjectEffort::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/project_efforts/' . $effortId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testIndexWithoutParameters()
    {
        factory(ProjectEffort::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/project_efforts');
        $this->assertCount(count(ProjectEffort::all()), $this->responseToArray());
    }

    public function testIndexWithDateFromParameter()
    {
        factory(ProjectEffort::class)->create(['date' => '2099-01-01']);
        factory(ProjectEffort::class)->create(['date' => '2098-12-31']);

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?date_from=2099-01-01');
        $this->assertCount(1, $this->responseToArray());
    }

    public function testIndexWithDateToParameter()
    {
        factory(ProjectEffort::class)->create(['date' => '1900-01-01']);
        factory(ProjectEffort::class)->create(['date' => '1900-01-02']);

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?date_to=1900-01-01');
        $this->assertCount(1, $this->responseToArray());
    }

    public function testIndexWithDateFromAndDateToParameter()
    {
        factory(ProjectEffort::class)->create(['date' => '2065-01-01']);
        factory(ProjectEffort::class)->create(['date' => '2077-01-01']);
        factory(ProjectEffort::class)->create(['date' => '2099-01-01']);
        factory(ProjectEffort::class)->create(['date' => '2099-01-02']);

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?date_from=2077-01-01&date_to=2099-01-01');
        $this->assertCount(2, $this->responseToArray());
    }

    public function testIndexWithDateFromAndProjectParameter()
    {
        $projectId = factory(Project::class)->create()->id;
        $projectPositionId = factory(ProjectPosition::class)->create([
            'project_id' => $projectId
        ])->id;

        factory(ProjectEffort::class)->create(['date' => '2065-01-01', 'position_id' => $projectPositionId]);
        factory(ProjectEffort::class)->create(['date' => '2064-01-01', 'position_id' => $projectPositionId]);
        $this->createRandomProjectWithEfforts();

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?date_from=2065-01-01&project=' . $projectId);
        $this->assertCount(1, $this->responseToArray());
    }

    public function testIndexWithDateToAndProjectParameter()
    {
        $projectId = factory(Project::class)->create()->id;
        $projectPositionId = factory(ProjectPosition::class)->create([
            'project_id' => $projectId
        ])->id;

        factory(ProjectEffort::class)->create(['date' => '2065-01-01', 'position_id' => $projectPositionId]);
        factory(ProjectEffort::class)->create(['date' => '2066-01-01', 'position_id' => $projectPositionId]);
        $this->createRandomProjectWithEfforts();

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?date_to=2065-01-01&project=' . $projectId);
        $this->assertCount(1, $this->responseToArray());
    }

    public function testIndexWithAllPossibleParams()
    {
        $projectId = factory(Project::class)->create()->id;
        $projectPositionId = factory(ProjectPosition::class)->create([
            'project_id' => $projectId
        ])->id;

        factory(ProjectEffort::class)->create(['date' => '2064-01-01', 'position_id' => $projectPositionId]);
        factory(ProjectEffort::class)->create(['date' => '2065-01-01', 'position_id' => $projectPositionId]);
        factory(ProjectEffort::class)->create(['date' => '2066-01-01', 'position_id' => $projectPositionId]);
        $this->createRandomProjectWithEfforts();

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?date_from=2065-01-01&date_to=2065-12-01&project=' . $projectId);
        $this->assertCount(1, $this->responseToArray());
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/project_efforts', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = $this->projectEffortTemplate();
        $this->asAdmin()->json('POST', 'api/v1/project_efforts', $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/project_efforts/1789764', $this->projectEffortTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $effortId = factory(ProjectEffort::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/project_efforts/' . $effortId, [])->assertResponseStatus(422);
    }

    public function testValidPut()
    {
        $effortId = factory(ProjectEffort::class)->create()->id;
        $template = $this->projectEffortTemplate();
        $this->asAdmin()->json('PUT', 'api/v1/project_efforts/' . $effortId, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    private function projectEffortTemplate()
    {
        return [
            'date' => '2012-12-31',
            'employee_id' => factory(\App\Models\Employee\Employee::class)->create()->id,
            'position_id' => factory(\App\Models\Project\ProjectPosition::class)->create()->id,
            'value' => 13.37
        ];
    }

    private function createRandomProjectWithEfforts()
    {
        $projectId = factory(Project::class)->create();
        $projectPositionId = factory(ProjectPosition::class)->create([
            'project_id' => $projectId
        ])->id;

        factory(ProjectEffort::class)->create(['date' => '2064-01-01', 'position_id' => $projectPositionId]);
        factory(ProjectEffort::class)->create(['date' => '2065-01-01', 'position_id' => $projectPositionId]);
        factory(ProjectEffort::class)->create(['date' => '2066-01-01', 'position_id' => $projectPositionId]);
    }
}
