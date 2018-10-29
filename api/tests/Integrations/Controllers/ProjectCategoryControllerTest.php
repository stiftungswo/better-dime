<?php

namespace Tests\Integrations\Controllers;

use App\Models\Project\ProjectCategory;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ProjectCategoryControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testIndex()
    {
        $projectCategoryId = factory(ProjectCategory::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/project_categories')->assertResponseOk();
        $decodedResponse = $this->responseToArray();
        $this->assertCount(count(ProjectCategory::all()), $decodedResponse);
    }

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/project_categories/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $projectCategoryId = factory(ProjectCategory::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/project_categories/' . $projectCategoryId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/project_categories', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = [
            'name' => 'Artenschutz',
        ];
        $this->asAdmin()->json('POST', 'api/v1/project_categories', $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/project_categories/1789764', [
            'name' => 'Artenschutz',
        ])->assertResponseStatus(404);
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
        $template = [
            'name' => 'Artenschutz'
        ];
        $this->asAdmin()->json('PUT', 'api/v1/project_categories/' . $projectCategoryId, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }
}
