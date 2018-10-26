<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Service\Service;
use App\Models\Service\ServiceRate;
use Illuminate\Database\QueryException;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class ServiceController extends BaseController
{

    public function index()
    {
        return Service::all();
    }

    public function get($id)
    {
        return Service::with('serviceRates')->find($id);
    }

    public function post()
    {
        $s = Service::create(Input::toArray());

        foreach (Input::get('service_rates') as $rate) {
            $r = ServiceRate::make($rate);
            $r->service_id = $s->id;
            $r->save();
        }
        return $s;
    }

    // i am super unhappy with how complicated this is, but that's the price we pay for doing nested updates.
    // we can probably extract the logic into a generic function though.
    public function put($id)
    {
        try {
            DB::beginTransaction();
            $s = Service::findOrFail($id);
            $s->update(Input::toArray());

            $this->executeNestedUpdate(
                Input::get('service_rates'),
                $s->serviceRates,
                ServiceRate::class,
                'service',
                $s
            );
        } catch (QueryException $e) {
            if (str_contains($e->getMessage(), 'service_rates_service_id_rate_group_id_unique')) {
                return new Response('Einer der neuen Tarife ist bereits erfasst', 400);
            }
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        DB::commit();
    }

    public function delete($id)
    {
        Service::findOrFail($id)->delete();
    }
}
