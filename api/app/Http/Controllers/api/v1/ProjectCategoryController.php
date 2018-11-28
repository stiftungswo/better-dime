<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Project\ProjectCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class ProjectCategoryController extends BaseController
{
    public function archive($id, Request $request)
    {
        $projectCategory = ProjectCategory::findOrFail($id);
        return self::doArchive($projectCategory, $request);
    }

    public function index()
    {
        return ProjectCategory::all();
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $projectCategory = ProjectCategory::create(Input::toArray());
        return self::get($projectCategory->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        ProjectCategory::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    private function get($id)
    {
        return ProjectCategory::findOrFail($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255'
        ]);
    }
}
