<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Project\ProjectEffort;
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
        $this->validateIndexRequest($request);

        $base = DB::table('project_efforts')->where('project_efforts.deleted_at');

        if (Input::get('date_from')) {
            $base->where('project_efforts.date', '>=', Input::get('date_from'));
        }

        if (Input::get('date_to')) {
            $base->where('project_efforts.date', '<=', Input::get('date_to'));
        }

        if (Input::get('project')) {
            $base->leftJoin('project_positions', 'project_positions.id', '=', 'project_efforts.position_id')
                ->leftJoin('projects', 'projects.id', '=', 'project_positions.project_id')
                ->where('projects.id', '=', Input::get('project'));
        }

        return $base->get(['project_efforts.*']);
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

    private function get($id)
    {
        return ProjectEffort::findOrFail($id);
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

    private function validateIndexRequest(Request $request)
    {
        $this->validate($request, [
            'date_from' => 'date',
            'date_to' => 'date',
            'project' => 'integer'
        ]);
    }
}
