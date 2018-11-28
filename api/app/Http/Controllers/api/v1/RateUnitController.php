<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Service\RateUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class RateUnitController extends BaseController
{
    public function archive($id, Request $request)
    {
        $rateUnit = RateUnit::findOrFail($id);
        return self::doArchive($rateUnit, $request);
    }

    public function index()
    {
        return RateUnit::all();
    }

    public function get($id)
    {
        return RateUnit::findOrFail($id);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $rateUnit = RateUnit::create(Input::toArray());
        return self::get($rateUnit->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        RateUnit::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'archived' => 'boolean',
            'billing_unit' => 'required|string|max:255',
            'effort_unit' => 'required|string|max:255',
            'factor' => 'required|numeric',
            'is_time' => 'required|boolean',
            'name' => 'required|string'
        ]);
    }
}
