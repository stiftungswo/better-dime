<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\GlobalSettings;
use App\Models\Offer\Offer;
use App\Models\Offer\OfferDiscount;
use App\Models\Offer\OfferPosition;
use App\Services\AddressLabelBuilder;
use App\Services\Creator\CreateProjectFromOffer;
use App\Services\PDF\GroupMarkdownToDiv;
use App\Services\PDF\PDF;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
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

    public function duplicate($id)
    {
        $offer = Offer::findOrFail($id);
        $newOffer  =$this->duplicateObject($offer, ['discounts']);

        foreach ($offer->positions as $position) {
            $attributes = ['service_id', 'price_per_rate', 'vat', 'order', 'amount'];
            $offerPosition = new OfferPosition();

            foreach ($attributes as $attribute) {
                $offerPosition = $this->assignOrThrowExceptionIfNull($position, $offerPosition, $attribute);
            }

            if ($position->description) {
                $offerPosition->description = $position->description;
            }

            if ($position->position_group_id) {
                $offerPosition->position_group_id = $position->position_group_id;
            }

            // update the service rate to a valid service rate just in case the one we are duplicating
            // uses an archived rate unit
            $service_rate = $offerPosition->service->service_rates
                ->where('rate_group_id', $offer->rate_group->id)
                ->filter(function ($service_rate, $key){
                    return $service_rate->rate_unit->archived == false;
                })
                ->first();

            // only update the service rate if we found a valid one
            if(!is_null($service_rate)){
                $offerPosition->rate_unit_id = $service_rate->rate_unit->id;
            }else{
                $offerPosition->rate_unit_id = $position->rate_unit_id;
            }

            self::get($newOffer)->positions()->save($offerPosition);
        }

        return self::get($newOffer);
    }

    public function index(Request $request)
    {
        $query = $this->getFilteredQuery(Offer::query(), $request, ['id', 'name', 'short_description']);
        return $this->getPaginatedQuery($query, $request);
    }

    public function get($id)
    {
        return Offer::with(['discounts', 'positions'])->findOrFail($id)->append(['breakdown', 'invoice_ids', 'project_id', 'position_groupings']);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $offer = Offer::create(Input::toArray());

        foreach (Input::get('discounts') as $discount) {
            /** @var OfferDiscount $od */
            $od = OfferDiscount::make($discount);
            $od->offer()->associate($offer);
            $od->save();
        }

        foreach (Input::get('positions') as $position) {
            /** @var OfferPosition $op */
            $op = OfferPosition::make($position);
            $op->offer()->associate($offer);
            $op->save();
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

            $this->executeNestedUpdate(
                Input::get('discounts'),
                $offer->discounts,
                OfferDiscount::class,
                'offer',
                $offer
            );

            $this->executeNestedUpdate(
                Input::get('positions'),
                $offer->positions,
                OfferPosition::class,
                'offer',
                $offer
            );
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

        // render address
        $addressLabel = AddressLabelBuilder::build($offer);

        $settings = GlobalSettings::all()->first();

        // initialize PDFController, render view and pass it back
        $pdf = new PDF(
            'offers',
            [
                'addressLabel' => $addressLabel,
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

        return $pdf->print("Offerte $offer->name", Carbon::now());
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

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'accountant_id' => 'required|integer',
            'customer_id' => 'required|integer',
            'address_id' => 'required|integer',
            'description' => 'required|string',
            'discounts' => 'present|array',
            'discounts.*.name' => 'required|string|max:255',
            'discounts.*.percentage' => 'required|boolean',
            'discounts.*.value' => 'required|numeric',
            'fixed_price' => 'integer|nullable',
            'name' => 'required|string|max:255',
            'positions' => 'present|array',
            'positions.*.amount' => 'required|numeric',
            'positions.*.description' => 'nullable|string',
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
