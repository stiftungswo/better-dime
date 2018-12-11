<?php

namespace Tests\Integrations\Controllers;

use App\Models\Project\Project;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;
use App\Models\Service\Service;
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

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?start=2099-01-01');
        $this->assertCount(1, $this->responseToArray());
    }

    public function testIndexWithDateToParameter()
    {
        factory(ProjectEffort::class)->create(['date' => '1900-01-01']);
        factory(ProjectEffort::class)->create(['date' => '1900-01-02']);

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?end=1900-01-01');
        $this->assertCount(1, $this->responseToArray());
    }

    public function testIndexWithDateFromAndDateToParameter()
    {
        factory(ProjectEffort::class)->create(['date' => '2065-01-01']);
        factory(ProjectEffort::class)->create(['date' => '2077-01-01']);
        factory(ProjectEffort::class)->create(['date' => '2099-01-01']);
        factory(ProjectEffort::class)->create(['date' => '2099-01-02']);

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?start=2077-01-01&end=2099-01-01');
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

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?start=2065-01-01&project_ids=' . $projectId);
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

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?end=2065-01-01&project_ids=' . $projectId);
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

        $this->asAdmin()->json('GET', 'api/v1/project_efforts?start=2065-01-01&end=2065-12-01&project_ids=' . $projectId);
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

    public function testMoveEffortsWithNullService()
    {
        $oldProject = factory(Project::class)->create();
        $newProject = factory(Project::class)->create();
        $oldPosition = factory(ProjectPosition::class)->create([
            'project_id' => $oldProject->id,
            'service_id' => null
        ]);
        $oldEffortIds = factory(ProjectEffort::class, 1)->create([
            'position_id' => $oldPosition->id
        ])->map(function ($pe) {
            return $pe->id;
        })->toArray();

        $this->asAdmin()->json('PUT', 'api/v1/project_efforts/move', [
            'effort_ids' => $oldEffortIds,
            'project_id' => $newProject->id,
            'position_id' => null
        ])->assertResponseStatus(400);
    }

    public function testMoveEffortsWithoutExistingProjectPosition()
    {
        $oldServiceId = factory(Service::class)->create()->id;
        $oldProject = factory(Project::class)->create();
        $newProject = factory(Project::class)->create();
        $oldPosition = factory(ProjectPosition::class)->create([
            'project_id' => $oldProject->id,
            'service_id' => $oldServiceId
        ]);
        $oldEffortIds = factory(ProjectEffort::class, 10)->create([
            'position_id' => $oldPosition->id
        ])->map(function ($pe) {
            return $pe->id;
        })->toArray();

        $newProject = $newProject->fresh(['positions']);
        $this->assertCount(0, $newProject->positions);

        $this->asAdmin()->json('PUT', 'api/v1/project_efforts/move', [
            'effort_ids' => $oldEffortIds,
            'project_id' => $newProject->id,
            'position_id' => null
        ])->assertResponseOk();

        $newProject = $newProject->fresh(['positions']);
        $this->assertCount(1, $newProject->positions);
        $this->assertCount(10, $newProject->positions->first()->efforts);
    }

    public function testMoveEffortWithExistingProjectPosition()
    {
        $oldServiceId = factory(Service::class)->create()->id;

        $oldProject = factory(Project::class)->create();
        $newProject = factory(Project::class)->create();

        $oldPosition = factory(ProjectPosition::class)->create([
            'project_id' => $oldProject->id,
            'service_id' => $oldServiceId
        ]);
        $newPosition = factory(ProjectPosition::class)->create([
            'project_id' => $newProject->id,
            'service_id' => $oldServiceId
        ]);

        $oldEffortIds = factory(ProjectEffort::class, 10)->create([
            'position_id' => $oldPosition->id
        ])->map(function ($pe) {
            return $pe->id;
        })->toArray();

        $newProject = $newProject->fresh(['positions']);
        $newPosition = $newPosition->fresh(['efforts']);
        $this->assertCount(1, $newProject->positions);
        $this->assertCount(0, $newPosition->efforts);

        $this->asAdmin()->json('PUT', 'api/v1/project_efforts/move', [
            'effort_ids' => $oldEffortIds,
            'project_id' => $newProject->id,
            'position_id' => null
        ])->assertResponseOk();

        $newProject = $newProject->fresh(['positions']);
        $newPosition = $newPosition->fresh(['efforts']);
        $this->assertCount(1, $newProject->positions);
        $this->assertCount(10, $newPosition->efforts);
    }

    public function testMoveEffortsWithTargetPosition()
    {
        // this moves all timeslices to the target position, regardless of their origin
        $oldService1 = factory(Service::class)->create();
        $oldService2 = factory(Service::class)->create();
        $newService = factory(Service::class)->create();

        $oldProject = factory(Project::class)->create();
        $newProject = factory(Project::class)->create();

        $oldProjectPosition1 = factory(ProjectPosition::class)->create([
            'project_id' => $oldProject->id,
            'service_id' => $oldService1->id
        ]);
        $oldProjectPosition2 = factory(ProjectPosition::class)->create([
            'project_id' => $oldProject->id,
            'service_id' => $oldService2->id
        ]);
        $newProjectPosition = factory(ProjectPosition::class)->create([
            'project_id' => $newProject->id,
            'service_id' => $newService->id
        ]);

        $oldEffortIds = factory(ProjectEffort::class, 10)->create([
            'position_id' => $oldProjectPosition1->id
        ])->map(function ($pe) {
            return $pe->id;
        });

        $oldEffortIds = $oldEffortIds->merge(factory(ProjectEffort::class, 10)->create([
            'position_id' => $oldProjectPosition2->id
        ])->map(function ($pe) {
            return $pe->id;
        }))->toArray();

        $this->assertCount(2, $oldProject->positions);
        $this->assertCount(10, $oldProjectPosition1->efforts);
        $this->assertCount(10, $oldProjectPosition2->efforts);
        $this->assertCount(1, $newProject->positions);
        $this->assertCount(0, $newProjectPosition->efforts);

        $this->asAdmin()->json('PUT', 'api/v1/project_efforts/move', [
            'effort_ids' => $oldEffortIds,
            'project_id' => $newProject->id,
            'position_id' => $newProjectPosition->id
        ])->assertResponseOk();

        // refresh entities from database
        $oldProjectPosition1 = $oldProjectPosition1->fresh('efforts');
        $oldProjectPosition2 = $oldProjectPosition2->fresh('efforts');
        $newProject = $newProject->fresh('positions');
        $newProjectPosition = $newProjectPosition->fresh('efforts');

        $this->assertCount(0, $oldProjectPosition1->efforts);
        $this->assertCount(0, $oldProjectPosition2->efforts);
        $this->assertCount(1, $newProject->positions);
        $this->assertCount(20, $newProjectPosition->efforts);
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
