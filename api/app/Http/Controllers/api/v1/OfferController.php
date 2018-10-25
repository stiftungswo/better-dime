<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Offer\Offer;
use App\Models\Offer\OfferDiscount;
use App\Models\Offer\OfferPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class OfferController extends BaseController
{
    public function delete($id)
    {
        Offer::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function index()
    {
        return Offer::all();
    }

    public function get($id)
    {
        return Offer::with(['discounts', 'positions'])->findOrFail($id);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $inputParams = Input::toArray();
        $inputParams['customer_type'] = $inputParams['customer_type'] == 'company' ? \App\Models\Customer\Company::class : \App\Models\Customer\Person::class;
        $offer = Offer::create(Input::toArray());

        if (Input::get('discounts')) {
            foreach (Input::get('discounts') as $discount) {
                /** @var OfferDiscount $od */
                $od = OfferDiscount::make($discount);
                $od->offer()->associate($offer);
                $od->save();
            }
        }

        if (Input::get('positions')) {
            foreach (Input::get('positions') as $position) {
                /** @var OfferPosition $op */
                $op = OfferPosition::make($position);
                $op->offer()->associate($offer);
                $op->save();
            }
        }

        return self::get($offer->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        $offer = Offer::findOrFail($id);
        try {
            DB::beginTransaction();
            $offer->update(Input::toArray());

            if (Input::get('discounts')) {
                $this->executeNestedUpdate(Input::get('discounts'), $offer->discounts, OfferDiscount::class, 'offer', $offer);
            }

            if (Input::get('positions')) {
                $this->executeNestedUpdate(Input::get('positions'), $offer->positions, OfferPosition::class, 'offer', $offer);
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
            'customer_id' => 'required|integer',
            'customer_type' => 'required|string|max:255',
            'description' => 'required|string',
            'discounts.*.name' => 'required|string|max:255',
            'discounts.*.percentage' => 'required|boolean',
            'discounts.*.value' => 'required|numeric',
            'fixed_price' => 'integer',
            'name' => 'required|string|max:255',
            'positions.*.amount' => 'required|integer',
            'positions.*.order' => 'required|integer',
            'positions.*.price_per_rate' => 'required|integer',
            'positions.*.rate_unit_id' => 'required|integer',
            'positions.*.service_id' => 'required|integer',
            'positions.*.vat' => 'required|numeric',
            'rate_group_id' => 'required|integer',
            'short_description' => 'required|string',
            'status' => 'required|integer'
        ]);
    }
}
