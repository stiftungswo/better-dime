<?php

namespace App\Services\Filter;

use App\Models\Costgroup\Costgroup;
use App\Models\Invoice\Invoice;
use App\Models\Offer\Offer;
use App\Models\Project\Project;
use App\Services\CostBreakdown;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RevenuePosition
{
    public $source = null;
    public $name = null;
    public $category = null;
    public $customer = null;
    public $created = null;
    public $accountant = null;
    public $offer_price = null;
    public $project_price = null;
    public $invoice_price = null;
    public $costgroup_values = [];
}

class RevenuePositions
{
    public static function fetchRevenueReport(Carbon $start, Carbon $end)
    {

        return self::offers($start, $end)->concat(self::projects($start, $end))->concat(self::invoices($start, $end));
    }

    private static function offers(Carbon $start, Carbon $end)
    {
        $offers = Offer::with([])->doesntHave('project')->whereBetween('created_at', [$start, $end])->get();

        return $offers->map(function ($offer) {
            $row = new RevenuePosition();
            $row->source = 'Offerte';
            $row->name = $offer->name;
            $row->category = null;
            $row->customer = self::getCustomerName($offer->customer);
            $row->created = $offer->created_at;
            $row->accountant = $offer->accountant !== null ? $offer->accountant->full_name : '';

            $breakdown = CostBreakdown::calculate($offer);
            $row->offer_price = $breakdown['total'];

            return $row;
        });
    }

    private static function invoices(Carbon $start, Carbon $end)
    {
        $invoices = Invoice::with([])->whereNull('project_id')->whereBetween('created_at', [$start, $end])->get();

        return $invoices->map(function ($invoice) {
            $row = new RevenuePosition();
            $row->source = 'Rechnung';
            $row->name = $invoice->name;
            $row->category = null;
            $row->customer = self::getCustomerName($invoice->customer);
            $row->created = $invoice->created_at;
            $row->accountant = $invoice->accountant !== null ? $invoice->accountant->full_name : '';

            $row->offer_price = null;
            $row->project_price = null;

            $breakdown = CostBreakdown::calculate($invoice);

            $row->invoice_price = $breakdown['total'];

            $costgroups = [];
            foreach ($invoice->distribution_of_costgroups as $group) {
                $costgroups[(string)$group['costgroup_number']] = $row->invoice_price * ($group['ratio'] / 100);
            }

            $row->costgroup_values = self::mapCostgroupNames($costgroups);

            return $row;
        });
    }

    private static function projects(Carbon $start, Carbon $end)
    {
        // #27 - get all projects that have an effort booked in the given time frame
        $eligibleProjectIds = DB::table('project_efforts')
            ->join('project_positions', 'position_id', '=', 'project_positions.id')
            ->whereNull('project_efforts.deleted_at')
            ->whereBetween('date', [$start, $end])
            ->get(['project_positions.project_id'])
            ->map(function ($row) {
                return $row->project_id;
            })
            ->unique()
            ->values();

        $projects = Project::with([
            'efforts', 'efforts.position',
            'costgroup_distributions',
            'category', 'customer', 'accountant',
            'invoices', 'invoices.positions',
            'offer', 'offer.positions'])->find($eligibleProjectIds);

        return $projects->map(function ($project) {
            $row = new RevenuePosition();
            $row->source = 'Projekt';
            $row->name = $project->name;
            $row->category = $project->category !== null ? $project->category->name : '';
            $row->customer = self::getCustomerName($project->customer);
            $row->created = $project->created_at;
            $row->accountant = $project->accountant !== null ? $project->accountant->full_name : '';

            $row->offer_price = $project->budget_price;
            $row->project_price = $project->current_price;


            /** @var Collection $invoicesOfProject */
            $invoicesOfProject = $project->invoices->map(function ($invoice) {
                return [
                    'breakdown' => CostBreakdown::calculate($invoice),
                    'invoice' => $invoice
                ];
            });
            $row->invoice_price = $invoicesOfProject->map(function ($invoiceInformations) {
                return $invoiceInformations['breakdown']['total'];
            })->sum();

            $projectCostgroupSplit = [];
            foreach ($project->distribution_of_costgroups as $group) {
                if (!isset($projectCostgroupSplit[(string)$group['costgroup_number']])) {
                    $projectCostgroupSplit[(string)$group['costgroup_number']] = 0;
                }

                $projectCostgroupSplit[(string)$group['costgroup_number']] += $row->project_price * ($group['ratio'] / 100) * -1;
            }

            $invoiceCostgroupSplits = [];
            foreach ($invoicesOfProject as $invoiceWithBreakdown) {
                $split = [];
                foreach ($invoiceWithBreakdown['invoice']->distribution_of_costgroups as $group) {
                    if (!isset($split[(string)$group['costgroup_number']])) {
                        $split[(string)$group['costgroup_number']] = 0;
                    }

                    $split[(string)$group['costgroup_number']] += $invoiceWithBreakdown['breakdown']['total'] * ($group['ratio'] / 100);
                }

                $invoiceCostgroupSplits[] = $split;
            }

            $row->costgroup_values = self::mapCostgroupNames(self::mergeCostgroupSplits(array_merge([$projectCostgroupSplit], $invoiceCostgroupSplits)));

            return $row;
        });
    }

    private static function mergeCostgroupSplits(array $splits): array
    {
        $merged = [];
        foreach ($splits as $split) {
            foreach ($split as $group => $sum) {
                if (isset($merged[$group])) {
                    $merged[$group] += $split[$group];
                } else {
                    $merged[$group] = $split[$group];
                }
            }
        }
        return $merged;
    }

    private static function mapCostgroupNames(array $groups): array
    {
        $out = [];
        foreach (collect($groups)->keys()->sort() as $number) {
            $name = $number . " (" . Costgroup::find($number)->name . ")";
            $out[$name] = $groups[$number];
        }
        return $out;
    }

    private static function getCustomerName($customer)
    {
        if (is_null($customer)) {
            return null;
        } elseif ($customer->type == 'company') {
            return $customer->name;
        } else {
            return $customer->full_name;
        }
    }
}
