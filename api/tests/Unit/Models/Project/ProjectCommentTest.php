<?php

namespace Tests\Unit\Models\Project;

use App\Models\Project\Project;
use App\Models\Project\ProjectComment;

class ProjectCommentTest extends \TestCase
{

    public function testProjectAssignment()
    {
        $project = factory(Project::class)->make();
        $comment = factory(ProjectComment::class)->make();
        $comment->project()->associate($project);
        $this->assertEquals($project, $comment->project);
    }
}
