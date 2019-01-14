<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Service\Service;
use App\Models\Service\ServiceRate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class ServiceController extends BaseController
{

    public function archive($id, Request $request)
    {
        $service = Service::findOrFail($id);
        return self::doArchive($service, $request);
    }

    public function index()
    {
        return Service::all();
    }

    public function get($id)
    {
        return Service::with('service_rates')->findOrFail($id);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $s = Service::create(Input::toArray());

        foreach (Input::get('service_rates') as $rate) {
            $r = ServiceRate::make($rate);
            $r->service_id = $s->id;
            $r->save();
        }
        return self::get($s->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);

        try {
            DB::beginTransaction();
            $s = Service::findOrFail($id);
            $s->update(Input::toArray());

            $this->executeNestedUpdate(
                Input::get('service_rates'),
                $s->service_rates,
                ServiceRate::class,
                'service',
                $s
            );
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        DB::commit();

        return self::get($s->id);
    }

    public function duplicate($id)
    {
        $service = Service::findOrFail($id);
        return self::get($this->duplicateObject($service, ['service_rates']));
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'archived' => 'boolean',
            'description' => 'string|nullable',
            'name' => 'required|string',
            'service_rates' => 'present|array',
            'service_rates.*.rate_group_id' => 'required|integer',
            'service_rates.*.rate_unit_id' => 'required|integer',
            'service_rates.*.value' => 'required|integer',
            'vat' => 'required|numeric',
            'order' => 'required|numeric'
        ]);
    }
}
