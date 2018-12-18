<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Project\Project;
use App\Models\Project\ProjectCostgroupDistribution;
use App\Models\Project\ProjectPosition;
use App\Services\Creator\CreateInvoiceFromProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class ProjectController extends BaseController
{

    public function archive($id, Request $request)
    {
        $project = Project::findOrFail($id);
        return self::doArchive($project, $request);
    }

    public function delete($id)
    {
        $project = Project::findOrFail($id);
        if ($project->deletable) {
            $project->delete();
            return 'Entity deleted';
        } else {
            return response("You can't delete this project because either it already has invoices or people did book efforts on it", 422);
        }
    }

    public function duplicate($id)
    {
        $project = Project::findOrFail($id);
        return self::get($this->duplicateObject($project, ['costgroup_distributions', 'positions'], ['offer_id']));
    }

    public function index()
    {
        return Project::all()->each->append('deletable');
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $project = Project::create(Input::toArray());

        // because we enforce in the validation that costgroups must be present, we dont need to check it here as well
        foreach (Input::get('costgroup_distributions') as $costgroup) {
            /** @var ProjectCostgroupDistribution $pcd */
            $pcd = ProjectCostgroupDistribution::make($costgroup);
            $pcd->project()->associate($project);
            $pcd->save();
        }

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

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'accountant_id' => 'required|integer',
            'address_id' => 'required|integer',
            'archived' => 'boolean',
            'category_id' => 'required|integer',
            'chargeable' => 'boolean',
            'costgroup_distributions' => 'required|array',
            'costgroup_distributions.*.costgroup_number' => 'required|integer',
            'costgroup_distributions.*.weight' => 'required|integer',
            'deadline' => 'date|nullable',
            'description' => 'required|string',
            'fixed_price' => 'integer|nullable',
            'vacation_project' => 'boolean',
            'name' => 'required|string',
            'offer_id' => 'integer|nullable',
            'positions.*.description' => 'string|nullable',
            'positions.*.price_per_rate' => 'required|integer',
            'positions.*.rate_unit_id' => 'required|integer',
            'positions.*.service_id' => 'required|integer',
            'positions.*.vat' => 'required|numeric',
            'rate_group_id' => 'required|integer',
        ]);
    }

    public function get($id)
    {
        return Project::with(['costgroup_distributions', 'positions', 'positions.service'])->findOrFail($id)
            ->append(['budget_price', 'budget_time', 'current_price', 'current_time', 'invoice_ids']);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);

        /** @var Project $project */
        $project = Project::findOrFail($id);
        try {
            DB::beginTransaction();
            $project->update(Input::toArray());

            $this->executeNestedUpdate(Input::get('costgroup_distributions'), $project->costgroup_distributions, ProjectCostgroupDistribution::class, 'project', $project);

            if (Input::get('positions')) {
                $this->executeNestedUpdate(Input::get('positions'), $project->positions, ProjectPosition::class, 'project', $project);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        DB::commit();

        return self::get($id);
    }

    public function createInvoice($id)
    {
        $project = Project::findOrFail($id);

        $creator = new CreateInvoiceFromProject($project);
        return $creator->create();
    }
}
