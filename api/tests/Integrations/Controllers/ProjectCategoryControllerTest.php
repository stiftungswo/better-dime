<?php

namespace Tests\Integrations\Controllers;

use App\Models\Project\ProjectCategory;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ProjectCategoryControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testArchive()
    {
        $project = factory(ProjectCategory::class)->create([
            'archived' => false
        ]);
        $this->assertFalse($project->archived);
        $this->asAdmin()->json('PUT', 'api/v1/project_categories/' . $project->id . '/archive', [
            'archived' => true
        ])->assertResponseOk();
        $this->assertTrue($project->refresh()->archived);
    }

    public function testArchiveRestore()
    {
        $project = factory(ProjectCategory::class)->create([
            'archived' => true
        ]);
        $this->assertTrue($project->archived);
        $this->asAdmin()->json('PUT', 'api/v1/project_categories/' . $project->id . '/archive', [
            'archived' => false
        ])->assertResponseOk();
        $this->assertFalse($project->refresh()->archived);
    }

    public function testIndex()
    {
        factory(ProjectCategory::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/project_categories')->assertResponseOk();
        $this->assertCount(count(ProjectCategory::all()), $this->responseToArray());
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/project_categories', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $this->asAdmin()->json('POST', 'api/v1/project_categories', $this->projectCategoryTemplate())->assertResponseOk();
        $this->assertResponseMatchesTemplate($this->projectCategoryTemplate());
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/project_categories/1789764', $this->projectCategoryTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $projectCategoryId = factory(ProjectCategory::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/project_categories/' . $projectCategoryId, [])->assertResponseStatus(422);
    }

    public function testValidPut()
    {
        $projectCategoryId = factory(ProjectCategory::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/project_categories/' . $projectCategoryId, $this->projectCategoryTemplate())->assertResponseOk();
        $this->assertResponseMatchesTemplate($this->projectCategoryTemplate());
    }

    private function projectCategoryTemplate()
    {
        return [
            'archived' => false,
            'name' => 'Artenschutz'
        ];
    }
}
