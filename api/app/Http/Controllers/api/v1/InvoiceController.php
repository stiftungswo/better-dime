<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Invoice\InvoiceCostgroupDistribution;
use App\Models\Invoice\Invoice;
use App\Models\Invoice\InvoiceDiscount;
use App\Models\Invoice\InvoicePosition;
use App\Services\CostBreakdown;
use App\Services\PDF\GroupMarkdownToDiv;
use App\Services\PDF\PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Parsedown;

class InvoiceController extends BaseController
{
    public function delete($id)
    {
        Invoice::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function duplicate($id)
    {
        $invoice = Invoice::findOrFail($id);
        return self::get($this->duplicateObject($invoice, ['costgroup_distributions', 'discounts', 'positions']));
    }

    public function get($id)
    {
        return Invoice::with(['costgroup_distributions', 'discounts', 'positions'])->findOrFail($id)->append(['breakdown', 'offer_id', 'sibling_invoice_ids']);
    }

    public function index()
    {
        return Invoice::all();
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $invoice = Invoice::create(Input::toArray());

        // because we enforce in the validation that costgroups must be present, we dont need to check it here as well
        foreach (Input::get('costgroup_distributions') as $costgroup) {
            /** @var InvoiceCostgroupDistribution $cd */
            $cd = InvoiceCostgroupDistribution::make($costgroup);
            $cd->invoice()->associate($invoice);
            $cd->save();
        }

        if (Input::get('discounts')) {
            foreach (Input::get('discounts') as $discount) {
                /** @var InvoiceDiscount $id */
                $id = InvoiceDiscount::make($discount);
                $id->invoice()->associate($invoice);
                $id->save();
            }
        }

        if (Input::get('positions')) {
            foreach (Input::get('positions') as $position) {
                /** @var InvoicePosition $ip */
                $ip = InvoicePosition::make($position);
                $ip->invoice()->associate($invoice);
                $ip->save();
            }
        }

        return self::get($invoice->id);
    }

    public function print($id)
    {
        // initialize stuff
        $invoice = Invoice::with(['accountant', 'address', 'costgroup_distributions', 'project'])->findOrFail($id)->append('distribution_of_costgroups');
        $parsedown = new Parsedown();

        // group h1 / h2 / h3 and the following tags to divs
        $description = GroupMarkdownToDiv::group($parsedown->text($invoice->description));

        // initialize PDF, render view and pass it back
        $pdf = new PDF(
            'invoice',
            [
                'breakdown' => CostBreakdown::calculate($invoice),
                'invoice' => $invoice,
                'description' => $description
            ]
        );

        return $pdf->print();
    }

    public function print_esr($id)
    {
        // initialize stuff
        $invoice = Invoice::with(['address'])->findOrFail($id);
        $breakdown = CostBreakdown::calculate($invoice);

        // format total
        $splitted = str_split($breakdown['total']);
        $first_part = "";
        $first_part .= implode('', array_slice($splitted, 0, -2));
        $first_part .= " ";
        $first_part .= implode('', array_slice($splitted, -2, 2));

        // initialize PDF, render view and pass it back
        $pdf = new PDF(
            'esr',
            [
                'breakdown' => $breakdown,
                'invoice' => $invoice,
                'formatted_total' => $first_part
            ]
        );

        return $pdf->print();
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        /** @var Invoice $invoice */
        $invoice = Invoice::findOrFail($id);
        try {
            DB::beginTransaction();
            $invoice->update(Input::toArray());
            $this->executeNestedUpdate(Input::get('costgroup_distributions'), $invoice->costgroup_distributions, InvoiceCostgroupDistribution::class, 'invoice', $invoice);

            if (Input::get('discounts')) {
                $this->executeNestedUpdate(Input::get('discounts'), $invoice->discounts, InvoiceDiscount::class, 'invoice', $invoice);
            }

            if (Input::get('positions')) {
                $this->executeNestedUpdate(Input::get('positions'), $invoice->positions, InvoicePosition::class, 'invoice', $invoice);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        DB::commit();

        return self::get($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'accountant_id' => 'required|integer',
            'address_id' => 'required|integer',
            'costgroup_distributions' => 'required|array',
            'costgroup_distributions.*.costgroup_number' => 'required|integer',
            'costgroup_distributions.*.weight' => 'required|integer',
            'description' => 'required|string',
            'discounts.*.name' => 'required|string|max:255',
            'discounts.*.percentage' => 'required|boolean',
            'discounts.*.value' => 'required|numeric',
            'end' => 'required|date',
            'fixed_price' => 'integer|nullable',
            'positions.*.amount' => 'required|numeric',
            'positions.*.description' => 'required|string|max:255',
            'positions.*.order' => 'integer|nullable',
            'positions.*.price_per_rate' => 'required|integer',
            'positions.*.project_position_id' => 'integer|nullable',
            'positions.*.rate_unit_id' => 'required|integer',
            'positions.*.vat' => 'required|numeric',
            'project_id' => 'nullable|integer',
            'name' => 'required|string',
            'start' => 'required|date'
        ]);
    }
}
