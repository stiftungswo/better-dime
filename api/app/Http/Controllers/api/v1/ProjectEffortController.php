<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Project\Project;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;
use App\Services\Filter\ProjectEffortFilter;
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

        return ProjectEffortFilter::fetchList($validatedData);
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

    public function moveEfforts(Request $request)
    {
        $validatedData = $this->validate($request, [
            'effort_ids' => 'required|array',
            'effort_ids.*' => 'integer',
            'project_id' => 'required|integer',
            'position_id' => 'nullable|integer'
        ]);

        $targetProject = Project::findOrFail($validatedData['project_id']);
        $efforts = ProjectEffort::with(['position'])->findMany($validatedData['effort_ids']);

        foreach ($efforts as $effort) {
            /** @var ProjectEffort $effort */
            if (empty($validatedData['position_id'])) {
                $targetProject = $targetProject->fresh();
                $service = $effort->service;

                $targetPosition = null;

                if (is_null($service)) {
                    return response('Position ' . $effort->position->id . ' has no service assigned!', 400);
                } else {
                    foreach ($targetProject->positions as $position) {
                        if ($position->service->id == $service->id) {
                            $targetPosition = $position;
                            break;
                        }
                    }
                }

                if ($targetPosition == null) {
                    // create new position for target project
                    /** @var ProjectPosition $targetPosition */
                    $targetPosition = $effort->position->replicate();
                    $targetPosition->project()->associate($targetProject);
                    $targetPosition->save();
                }

                $effort->position()->associate($targetPosition);
                $effort->save();
            } else {
                $effort->position_id = $validatedData['position_id'];
                $effort->save();
            }
        }

        return 'Successfully moved timeslices!';
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
