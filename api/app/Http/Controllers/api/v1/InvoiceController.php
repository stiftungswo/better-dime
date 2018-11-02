<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Invoice\Costgroup;
use App\Models\Invoice\Invoice;
use App\Models\Invoice\InvoiceDiscount;
use App\Models\Invoice\InvoicePosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class InvoiceController extends BaseController
{
    public function delete($id)
    {
        Invoice::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function get($id)
    {
        return Invoice::with(['discounts', 'positions'])->findOrFail($id);
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
        foreach (Input::get('costgroups') as $costgroupNumber) {
            /** @var Costgroup $c */
            $c = Costgroup::where('number', '=', $costgroupNumber)->firstOrFail();
            $c->invoices()->save($invoice);
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

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        /** @var Invoice $invoice */
        $invoice = Invoice::findOrFail($id);
        try {
            DB::beginTransaction();
            $invoice->update(Input::toArray());
            $invoice->invoice_costgroups()->sync(Input::get('costgroups'));

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
            'costgroups' => 'required|array',
            'description' => 'required|string',
            'discounts.*.name' => 'required|string|max:255',
            'discounts.*.percentage' => 'required|boolean',
            'discounts.*.value' => 'required|numeric',
            'end' => 'required|date',
            'fixed_price' => 'integer',
            'positions.*.amount' => 'required|numeric',
            'positions.*.description' => 'required|string|max:255',
            'positions.*.order' => 'required|integer',
            'positions.*.project_position_id' => 'integer',
            'positions.*.rate_unit_id' => 'required|integer',
            'positions.*.vat' => 'required|numeric',
            'project_id' => 'required|integer',
            'name' => 'required|string',
            'start' => 'required|date'
        ]);
    }
}
