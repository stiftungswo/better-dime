<?php

namespace App\Services\Creator;

use App\Models\Invoice\Invoice;
use App\Models\Invoice\InvoiceCostgroupDistribution;
use App\Models\Invoice\InvoiceDiscount;
use App\Models\Invoice\InvoicePosition;
use App\Models\Project\Project;
use App\Models\Project\ProjectPosition;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreateInvoiceFromProject extends BaseCreator
{
    /**
     * @var Project $project
     */
    protected $project;

    /**
     * @var Invoice $invoice
     */
    protected $invoice;

    public function __construct(Project $project)
    {
        $this->project = $project;
        $this->invoice = new Invoice();
    }

    public function create()
    {
        $lastInvoice = DB::table('invoices')
            ->where('project_id', '=', $this->project->id)
            ->orderBy('end', 'desc')->first();

        // check if the DB query for the last invoice brought up something
        // if lastInvoice is null and project has no efforts booked, take yesterday's date as start date
        // else if lastInvoice is null and project has efforts booked, take the date of the first effort as start date
        // else if LastInvoice isn't null, take the last invoice's end and add one day to it as start date for the new invoice
        if (is_null($lastInvoice)) {
            if ($this->project->efforts->isEmpty()) {
                $this->invoice->start = Carbon::yesterday()->format('Y-m-d');
            } else {
                $this->invoice->start = $this->project->efforts->sortBy('date')->first()->date;
            }
        } else {
            $this->invoice->start = Carbon::parse($lastInvoice->end)->addDay()->format('Y-m-d');
        }

        if ($this->project->efforts->isEmpty()) {
            $this->invoice->end = Carbon::today();
        } else {
            $this->invoice->end = $this->project->efforts->sortByDesc('date')->first()->date;
        }

        $this->checkAndAssignInvoiceProperty('name');
        $this->checkAndAssignInvoiceProperty('description');
        $this->invoice->fixed_price = $this->project->fixed_price;

        $this->invoice->project()->associate($this->project);
        $this->invoice->customer()->associate($this->project->customer);
        $this->invoice->address()->associate($this->project->address);
        $this->invoice->accountant()->associate($this->project->accountant);
        $this->invoice->save();

        $this->project->positions->each(function ($pp) {
            /** @var ProjectPosition $pp */
            $ip = new InvoicePosition();
            $ip->amount = $pp->efforts_value;
            $ip->description = $pp->description ?: $pp->service->name;

            $attributes = ['price_per_rate', 'vat', 'order'];

            foreach ($attributes as $attribute) {
                $ip = $this->assignOrThrowExceptionIfNull($pp, $ip, $attribute);
            }

            $ip->project_position()->associate($pp);
            $ip->rate_unit()->associate($pp->rate_unit);
            $ip->invoice()->associate($this->invoice);
            $ip->save();
        });

        $this->project->costgroup_distributions->each(function ($pcd) {
           /** @var InvoiceCostgroupDistribution $invoiceCostgroupDistribution */
            $invoiceCostgroupDistribution = new InvoiceCostgroupDistribution();
            $invoiceCostgroupDistribution->costgroup_number = $pcd->costgroup_number;
            $invoiceCostgroupDistribution->invoice_id = $this->invoice->id;
            $invoiceCostgroupDistribution->weight = $pcd->weight;

            $invoiceCostgroupDistribution->save();
        });

        $offer = $this->project->offer;
        if (!is_null($offer)) {
            $offer->discounts->each(function ($od) {
                $id = new InvoiceDiscount();
                $id->name = $od->name;
                $id->percentage = $od->percentage;
                $id->value = $od->value;
                $id->invoice()->associate($this->invoice);
                $id->save();
            });
        }

        return $this->invoice->fresh(['costgroup_distributions', 'discounts', 'positions']);
    }

    private function checkAndAssignInvoiceProperty(string $property, $oldPropertyName = null)
    {
        return $this->assignOrThrowExceptionIfNull($this->project, $this->invoice, $property, $oldPropertyName);
    }
}
