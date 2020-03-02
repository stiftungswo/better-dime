<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Project\Project;
use App\Models\Project\ProjectCostgroupDistribution;
use App\Models\Project\ProjectPosition;
use App\Services\Creator\CreateInvoiceFromProject;
use App\Services\PDF\GroupMarkdownToDiv;
use App\Services\PDF\PDF;
use App\Services\ProjectEffortReportFetcher;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Pagination\Paginator;
use Parsedown;

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
        $newProject  =$this->duplicateObject($project, ['costgroup_distributions'], ['offer_id']);

        foreach ($project->positions as $position) {
            $attributes = ['service_id', 'price_per_rate', 'vat', 'order'];
            $projectPosition = new ProjectPosition();

            foreach ($attributes as $attribute) {
                $projectPosition = $this->assignOrThrowExceptionIfNull($position, $projectPosition, $attribute);
            }

            if ($position->description) {
                $projectPosition->description = $position->description;
            }

            if ($position->position_group_id) {
                $projectPosition->position_group_id = $position->position_group_id;
            }

            // update the service rate to a valid service rate just in case the one we are duplicating
            // uses an archived rate unit
            $service_rate = $projectPosition->service->service_rates
                ->where('rate_group_id', $project->rate_group->id)
                ->filter(function ($service_rate, $key) {
                    return $service_rate->rate_unit->archived == false;
                })
                ->first();

            // only update the service rate if we found a valid one
            if (!is_null($service_rate)) {
                $projectPosition->rate_unit_id = $service_rate->rate_unit->id;
            } else {
                $projectPosition->rate_unit_id = $position->rate_unit_id;
            }

            self::get($newProject)->positions()->save($projectPosition);
        }

        return self::get($newProject);
    }

    public function index(Request $request)
    {
        $query = $this->getFilteredQuery(Project::query(), $request, ['id', 'name', 'description']);
        return $this->getPaginatedQuery($query, $request, function (Collection $q) {
            return $q->each->append('deletable');
        });
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $project = Project::create(Input::toArray());

        foreach (Input::get('costgroup_distributions') as $costgroup) {
            /** @var ProjectCostgroupDistribution $pcd */
            $pcd = ProjectCostgroupDistribution::make($costgroup);
            $pcd->project()->associate($project);
            $pcd->save();
        }

        foreach (Input::get('positions') as $position) {
            /** @var ProjectPosition $pn */
            $pn = ProjectPosition::make($position);
            $pn->project()->associate($project);
            $pn->save();
        }

        return self::get($project->id);
    }

    public function printEffortReport($id, Request $request)
    {
        $validatedData = $this->validate($request, [
            'end' => 'nullable|date',
            'start' => 'nullable|date'
        ]);

        if (empty($validatedData['start'])) {
            $validatedData['start'] = null;
        }

        if (empty($validatedData['end'])) {
            $validatedData['end'] = null;
        }

        $project = Project::findOrFail($id);

        $commentsAndEffortsPerDate = ProjectEffortReportFetcher::fetch($project->id, $validatedData['start'], $project['end']);
        $parsedown = new Parsedown();
        $description = GroupMarkdownToDiv::group($parsedown->text($project->description));

        // some projects used to be split with ; instead of ,
        $legacySplit = explode(";", $project->name)[0];
        $splitName = $this->replaceUmlaute(explode(",", $legacySplit)[0]);
        $downloadName = "Aufwandsreport_Projekt_" . $project->id . "_" . $splitName . "_" . Carbon::now()->format("Y_m_d");

        // initialize PDF, render view and pass it back
        $pdf = new PDF(
            'project_effort_report',
            [
                'content' => $commentsAndEffortsPerDate,
                'end' => $validatedData['end'],
                'description' => $description,
                'project' => $project,
                'start' => $validatedData['start'],
                'title' => $downloadName
            ]
        );

        return $pdf->print($downloadName, Carbon::now());
    }

    private function replaceUmlaute($string)
    {
        $search = array("Ä", "Ö", "Ü", "ä", "ö", "ü", "ß", "´");
        $replace = array("Ae", "Oe", "Ue", "ae", "oe", "ue", "ss", "");
        return str_replace($search, $replace, $string);
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
            'positions' => 'present|array',
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
            ->append(['budget_price', 'budget_time', 'current_price', 'current_time', 'invoice_ids', 'position_groupings']);
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

            $this->executeNestedUpdate(Input::get('positions'), $project->positions, ProjectPosition::class, 'project', $project);
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

    protected function assignOrThrowExceptionIfNull($object1, $object2, string $property, $oldPropertyName = null)
    {
        if (is_null($oldPropertyName)) {
            $oldPropertyName = $property;
        }

        if (is_null($object1->$oldPropertyName)) {
            throw new \InvalidArgumentException('Cant create new entity because property ' . $oldPropertyName . ' is null.');
        } else {
            $object2->$property = $object1->$oldPropertyName;
        }
        return $object2;
    }

    public function projectsWithPotentialInvoices()
    {
        return DB::select(<<<QRY
select last_effort.id as id, name, last_effort_date, last_invoice_date, datediff(last_effort_date, last_invoice_date) days_since_last_invoice
from (
       select projects.id, max(pe.date) as last_effort_date, max(projects.name) as name
       from projects
              inner join project_positions pp on projects.id = pp.project_id
              inner join project_efforts pe on pp.id = pe.position_id
       where projects.chargeable = 1
       and projects.archived = 0
       and projects.deleted_at is null
       group by projects.id
     ) last_effort
       left join (
  select projects.id, max(i.ending) as last_invoice_date
  from projects
         left join invoices i on projects.id = i.project_id
  where i.deleted_at is null
  group by projects.id
) last_invoice on last_effort.id = last_invoice.id
 where last_invoice_date < last_effort_date or last_invoice_date is null
 order by id desc;
QRY
        );
    }
}
