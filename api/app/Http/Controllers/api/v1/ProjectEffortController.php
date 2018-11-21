<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Project\ProjectEffort;
use App\Services\Filter\TimetrackFilter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class ProjectEffortController extends BaseController
{
    public function delete($id)
    {
        ProjectEffort::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function index(Request $request)
    {
        $validatedData = $this->validate($request, [
            'project_id' => 'integer',
            'employee_ids' => 'string',
            'project_ids' => 'string',
            'service_ids' => 'string',
            'start' => 'date',
            'end' => 'date',
        ]);

        return TimetrackFilter::fetch($validatedData);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $effort = ProjectEffort::create(Input::toArray());
        return self::get($effort->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        ProjectEffort::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    public function get($id)
    {
        return ProjectEffort::findOrFail($id)->append('project_id');
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'date' => 'required|date',
            'employee_id' => 'required|integer',
            'position_id' => 'required|integer',
            'value' => 'required|numeric'
        ]);
    }
}
