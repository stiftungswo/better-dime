<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Costgroup\Costgroup;
use App\Models\Employee\Employee;
use App\Models\Invoice\Invoice;
use App\Models\Project\Project;
use App\Models\Project\ProjectEffort;
use App\Services\Export\CostgroupReport;
use App\Services\Export\RevenueReport;
use App\Services\Export\ServiceHoursPerCategoryReport;
use App\Services\Export\ServiceHoursPerProjectReport;
use App\Services\Filter\DailyEfforts;
use App\Services\Filter\ProjectCommentFilter;
use App\Services\Filter\ProjectEffortFilter;
use App\Services\Filter\RevenuePositions;
use App\Services\PDF\GroupMarkdownToDiv;
use App\Services\PDF\PDF;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use Parsedown;

class ReportController extends BaseController
{

    public function printEffortReport($id)
    {
        $invoice = Invoice::findOrFail($id);

        if ($invoice->project) {
            $efforts = ProjectEffortFilter::fetchSummary([
                'end' => $invoice->end,
                'project_ids' => $invoice->project->id,
                'start' => $invoice->start,
            ]);

            $comments = ProjectCommentFilter::fetch([
                'end' => $invoice->end,
                'project_id' => $invoice->project->id,
                'start' => $invoice->start,
            ]);

            // sort in stuff
            $commentsAndEffortsPerDate = [];
            $efforts->each(function ($e) use (&$commentsAndEffortsPerDate) {
                if (!array_key_exists($e->efforts_date, $commentsAndEffortsPerDate)) {
                    $commentsAndEffortsPerDate[$e->efforts_date] = [];
                }
                $commentsAndEffortsPerDate[$e->efforts_date]['efforts'][] = (array)$e;
            });

            $comments->each(function ($c) use (&$commentsAndEffortsPerDate) {
                if (!array_key_exists($c->date, $commentsAndEffortsPerDate)) {
                    $commentsAndEffortsPerDate[$c->date] = [];
                }
                $commentsAndEffortsPerDate[$c->date]['comments'][] = (array)$c;
            });

            ksort($commentsAndEffortsPerDate);
            $parsedown = new Parsedown();
            $description = GroupMarkdownToDiv::group($parsedown->text($invoice->description));

            // initialize PDF, render view and pass it back
            $pdf = new PDF(
                'invoice_effort_report',
                [
                    'content' => $commentsAndEffortsPerDate,
                    'description' => $description,
                    'invoice' => $invoice
                ]
            );

            return $pdf->print("Aufwandrapport $invoice->name", Carbon::now());
        } else {
            return response('Invoice ' . $invoice->id . ' has no project assigned!', 400);
        }
    }

    public function exportServiceHoursReport(Request $request)
    {
        $validatedData = $this->validate($request, [
            'end' => 'required|date',
            'group_by' => ['required', Rule::in(['project', 'category'])],
            'start' => 'required|date'
        ]);

        $effortForTimerange = ProjectEffort::with('position', 'position.project', 'position.project.category', 'position.service', 'position.service', 'position.rate_unit')
            ->whereBetween('date', [$validatedData['start'], $validatedData['end']])
            ->get();

        if ($validatedData['group_by'] == 'project') {
            return Excel::download(new ServiceHoursPerProjectReport($effortForTimerange), 'service_rapport_per_project.xlsx');
        } elseif ($validatedData['group_by'] == 'category') {
            return Excel::download(new ServiceHoursPerCategoryReport($effortForTimerange), 'service_rapport_per_category.xlsx');
        } else {
            return null;
        }
    }

    public function daily(Request $request)
    {
        $this->validate($request, [
            "from" => "date",
            "to" => "date"
        ]);

        $from = new Carbon(Input::get('from'));
        $to = new Carbon(Input::get('to'));

        return DailyEfforts::get($from, $to);
    }

    public function revenue(Request $request)
    {
        $this->validate($request, [
            "from" => "date",
            "to" => "date"
        ]);

        $from = new Carbon(Input::get('from'));
        $to = new Carbon(Input::get('to'));
        $format = Input::get('format');


        $report = RevenuePositions::fetchRevenueReport($from, $to);
        if ($format === 'json') {
            return $report;
        } else {
            return Excel::download(new RevenueReport($report), "revenue_report.xlsx");
        }
    }

    public function project(Request $request)
    {
        $this->validate($request, [
            "from" => "required|date",
            "to" => "required|date",
            "project_id" => "required|integer",
            "daily_rate" => "required|integer",
            "vat" => "required|numeric"
        ]);

        $from = new Carbon(Input::get('from'));
        $to = new Carbon(Input::get('to'));
        $projectId = Input::get('project_id');

        $project = Project::findOrFail($projectId);

        $efforts = $project->positions->flatMap(function ($position) {
            return $position->efforts;
        })->filter(function ($effort) use ($from, $to) {
            return $effort->position->is_time && Carbon::parse($effort->date)->between($from, $to);
        })->values()->map(function ($effort) {
            return [
                "date" => $effort->date,
                "value" => $effort->value / $effort->position->rate_unit->factor,
                "service" => $effort->position->service->name,
                "employee" => $effort->employee->full_name
            ];
        });

        $sums = $efforts->groupBy('employee')->map(function ($efforts, $employeeName) {
            return [
                "employee" => $employeeName,
                "sum" => $efforts->map(function ($effort) {
                    return $effort['value'];
                })->sum()
            ];
        });

        $chargedDays = $efforts->filter(function ($effort) {
            return $effort['value'] > 0;
        })->map(function ($effort) {
            return $effort['date'];
        })->unique()->values()->count();


        // initialize PDF, render view and pass it back
        $pdf = new PDF(
            'project_report',
            [
                "project" => $project,
                "from" => $from,
                "to" => $to,
                "efforts" => $efforts->sortBy(function ($effort) {
                    return [$effort['employee'], $effort['date']];
                }),
                "sums" => $sums,
                "chargedDays" => $chargedDays,
                "dailyRate" => Input::get('daily_rate'),
                "vat" => Input::get('vat')
            ]
        );

        return $pdf->print("Projektrapport $project->id $project->name", $from, $to);
    }

    public function costgroup(Request $request)
    {
        $this->validate($request, [
            "from" => "date",
            "to" => "date"
        ]);

        $from = new Carbon(Input::get('from'));
        $to = new Carbon(Input::get('to'));
        $format = Input::get('format');

        $efforts = ProjectEffort::whereBetween('date', [$from, $to])
            ->whereHas('employee', function ($q) {
                return $q->isSWOEmployee();
            })
            ->whereHas('position.rate_unit', function ($q) {
                return $q->where('is_time', 1);
            })
            ->has('position.project.costgroup_distributions')
            ->get();
        $costgroups = Costgroup::select('number')->get();
        if ($format === 'dump') {
            return "<pre>".var_export($efforts, true)."</pre>";
        } else {
            return Excel::download(new CostgroupReport($efforts, $costgroups), "costgroup_report.xlsx");
        }
    }
}
