<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Offer\Offer;
use App\Models\Offer\OfferDiscount;
use App\Models\Offer\OfferPosition;
use App\Services\Creator\CreateProjectFromOffer;
use App\Services\PDF\GroupMarkdownToDiv;
use App\Services\PDF\PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Laravel\Lumen\Application;
use Parsedown;

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
        return Offer::with(['discounts', 'positions'])->findOrFail($id)->append(['breakdown', 'invoice_ids', 'project_id']);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
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
                $this->executeNestedUpdate(
                    Input::get('discounts'),
                    $offer->discounts,
                    OfferDiscount::class,
                    'offer',
                    $offer
                );
            }

            if (Input::get('positions')) {
                $this->executeNestedUpdate(
                    Input::get('positions'),
                    $offer->positions,
                    OfferPosition::class,
                    'offer',
                    $offer
                );
            }
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        DB::commit();

        return self::get($id);
    }

    public function print($id)
    {
        // initialize stuff
        $app = new Application();
        $offer = Offer::with(['accountant', 'address', 'project:id'])->findOrFail($id);
        $parsedown = new Parsedown();

        // group h1 / h2 / h3 and the following tags to divs
        $description = GroupMarkdownToDiv::group($parsedown->text($offer->description));

        // initialize PDFController, render view and pass it back
        $pdf = new PDF(
            'offers',
            [
                'offer' => $offer,
                'breakdown' => $offer->breakdown,
                'basePath' => $app->basepath(),
                'description' => $description
            ]
        );

        // return $pdf->debug(
        //     'offers',
        //     [
        //         'offer' => $offer,
        //         'customer' => $offer->address->customer,
        //         'breakdown' => CostBreakdown::calculate($offer),
        //         'basePath' => $app->basepath(),
        //         'description' => $description
        //     ]
        // );

        return $pdf->print();
    }

    public function createProject($id)
    {
        $offer = Offer::findOrFail($id);

        if (is_null($offer->project)) {
            $creator = new CreateProjectFromOffer($offer);
            return $creator->create();
        } else {
            return $offer->project;
        }
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'accountant_id' => 'required|integer',
            'address_id' => 'required|integer',
            'description' => 'required|string',
            'discounts.*.name' => 'required|string|max:255',
            'discounts.*.percentage' => 'required|boolean',
            'discounts.*.value' => 'required|numeric',
            'fixed_price' => 'integer|nullable',
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
