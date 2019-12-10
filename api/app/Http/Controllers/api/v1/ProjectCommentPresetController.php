<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Project\ProjectCommentPreset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class ProjectCommentPresetController extends BaseController
{
    public function delete($id)
    {
        ProjectCommentPreset::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function get($id)
    {
        return ProjectCommentPreset::findOrFail($id);
    }

    public function index(Request $request)
    {
        $query = $this->getFilteredQuery(ProjectCommentPreset::query(), $request, ['comment_preset']);
        return $query->get();
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $projectCommentPreset = ProjectCommentPreset::create(Input::toArray());

        return self::get($projectCommentPreset->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        ProjectCommentPreset::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'comment_preset' => 'required|string',
        ]);
    }
}
