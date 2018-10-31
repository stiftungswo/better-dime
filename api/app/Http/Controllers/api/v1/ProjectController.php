<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Project\Project;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class ProjectController extends BaseController
{

    public function delete($id)
    {
        Project::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function index()
    {
        return Project::all();
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $project = Project::create(Input::toArray());

        if (Input::get('positions')) {
            foreach (Input::get('positions') as $position) {
                /** @var ProjectPosition $pn */
                $pn = ProjectPosition::make($position);
                $pn->project()->associate($project);
                $pn->save();
            }
        }

        return self::get($project->id);
    }

    public function moveEfforts($id)
    {
        $targetProject = Project::findOrFail($id);
        $efforts = ProjectEffort::with(['position'])->findMany(Input::get('efforts'));

        foreach ($efforts as $effort) {
            $targetProject = $targetProject->fresh();
            $service = $effort->service;

            $targetPosition = null;

            if (is_null($service)) {
                return response('Position ' . $effort->position->id . ' has no service assigned!', 422);
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
                $targetPosition = $effort->position->replicate();
                $targetPosition->project()->associate($targetProject);
                $targetPosition->save();
            }

            $effort->position()->associate($targetPosition);
            $effort->save();
        }

        return null;
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'accountant_id' => 'required|integer',
            'address_id' => 'required|integer',
            'archived' => 'boolean',
            'budget_price' => 'integer',
            'budget_time' => 'integer',
            'category_id' => 'required|integer',
            'chargeable' => 'boolean',
            'deadline' => 'date',
            'description' => 'required|string',
            'fixed_price' => 'integer',
            'name' => 'required|string',
            'offer_id' => 'integer',
            'positions.*.description' => 'string',
            'positions.*.price_per_rate' => 'required|integer',
            'positions.*.rate_unit_id' => 'required|integer',
            'positions.*.service_id' => 'required|integer',
            'positions.*.vat' => 'required|numeric',
            'rate_group_id' => 'required|integer',
            'started_at' => 'date',
            'stopped_at' => 'date',
        ]);
    }

    public function get($id)
    {
        return Project::with(['positions'])->findOrFail($id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);

        /** @var Project $p */
        $p = Project::findOrFail($id);
        try {
            DB::beginTransaction();
            $p->update(Input::toArray());

            if (Input::get('positions')) {
                $this->executeNestedUpdate(Input::get('positions'), $p->positions, ProjectPosition::class, 'project', $p);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        DB::commit();

        return self::get($id);
    }

    // TODO reimplement "Projects with potential invoices" after invoices are implemented
}
