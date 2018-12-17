<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Invoice\Invoice;
use App\Models\Project\ProjectEffort;
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
                'effort_report',
                [
                    'content' => $commentsAndEffortsPerDate,
                    'description' => $description,
                    'invoice' => $invoice
                ]
            );

            return $pdf->print();
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
        $format = new Carbon(Input::get('format'));


        $report = RevenuePositions::fetchRevenueReport($from, $to);
        if ($format === 'json') {
            return $report;
        } else {
            return Excel::download(new RevenueReport($report), "revenue_report.xlsx");
        }
    }
}
