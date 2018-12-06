<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Invoice\Invoice;
use App\Services\Filter\DailyEfforts;
use App\Services\Filter\ProjectCommentFilter;
use App\Services\Filter\ProjectEffortFilter;
use App\Services\PDF\PDF;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class ReportController extends BaseController
{

    public function printEffortReport($id)
    {
        // TODO revisit this report as soon as we implement a converted production build to check layout
        //      also to recheck the rendered data
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
            $tempArr = [];
            $efforts->each(function ($e) use (&$tempArr) {
                if (!array_key_exists($e->efforts_date, $tempArr)) {
                    $tempArr[$e->efforts_date] = [];
                }
                $tempArr[$e->efforts_date]['efforts'][] = (array)$e;
            });

            $comments->each(function ($c) use (&$tempArr) {
                if (!array_key_exists($c->date, $tempArr)) {
                    $tempArr[$c->date] = [];
                }
                $tempArr[$c->date]['comments'][] = (array)$c;
            });

            ksort($tempArr);

            // initialize PDF, render view and pass it back
            $pdf = new PDF(
                'effort_report',
                [
                    'content' => $tempArr,
                    'invoice' => $invoice
                ]
            );

            return $pdf->print();
        } else {
            return response('Invoice ' . $invoice->id . ' has no project assigned!', 400);
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
}
