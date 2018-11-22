<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Project\ProjectComment;
use App\Services\Filter\ProjectCommentFilter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class ProjectCommentController extends BaseController
{
    public function delete($id)
    {
        ProjectComment::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function get($id)
    {
        return ProjectComment::findOrFail($id);
    }

    public function index(Request $request)
    {
        $validatedInput = $this->validate($request, [
            'end' => 'date',
            'project_id' => 'integer',
            'start' => 'date'
        ]);

        return ProjectCommentFilter::fetch($validatedInput);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $projectComment = ProjectComment::create(Input::toArray());

        return self::get($projectComment->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        ProjectComment::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'comment' => 'required|string',
            'date' => 'required|date',
            'project_id' => 'required|integer'
        ]);
    }
}
