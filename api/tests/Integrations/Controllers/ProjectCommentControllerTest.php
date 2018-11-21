<?php

namespace Tests\Integrations\Controllers;

use App\Models\Project\Project;
use App\Models\Project\ProjectComment;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ProjectCommentControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/project_comments/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $projectCommentId = factory(ProjectComment::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/project_comments/' . $projectCommentId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testIndexWithoutParameters()
    {
        factory(ProjectComment::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/project_comments');
        $this->assertEquals(count(ProjectComment::all()), count($this->responseToArray()));
    }

    public function testIndexWithProjectParameter()
    {
        $project = factory(Project::class)->create();
        $project->comments()->saveMany(factory(ProjectComment::class, 5)->make());
        $this->asAdmin()->json('GET', 'api/v1/project_comments?project_id=' . $project->id);
        $this->assertEquals(5, count($this->responseToArray()));
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/project_comments', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = $this->projectCommentTemplate();
        $this->asAdmin()->json('POST', 'api/v1/project_comments', $template);
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/project_comments/1789764', $this->projectCommentTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $projectCommentId = factory(ProjectComment::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/project_comments/' . $projectCommentId, [])->assertResponseStatus(422);
    }

    public function testValidPut()
    {
        $projectCommentId = factory(ProjectComment::class)->create()->id;
        $template = $this->projectCommentTemplate();
        $this->asAdmin()->json('PUT', 'api/v1/project_comments/' . $projectCommentId, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    private function projectCommentTemplate()
    {
        return [
            'comment' => 'An diesem Tag haben wir etwas länger gearbeitet, da die Zivis sehr motiviert waren.',
            'date' => '2018-09-11',
            'project_id' => factory(Project::class)->create()->id
        ];
    }
}
