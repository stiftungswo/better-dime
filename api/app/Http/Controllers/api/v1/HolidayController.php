<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Employee\Holiday;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class HolidayController extends BaseController
{
    public function delete($id)
    {
        Holiday::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function duplicate($id)
    {
        $holiday = Holiday::findOrFail($id);
        return self::get($this->duplicateObject($holiday));
    }

    public function index()
    {
        return Holiday::all();
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $holiday = Holiday::create(Input::toArray());
        return self::get($holiday->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        Holiday::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    private function get($id)
    {
        return Holiday::findOrFail($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'date' => 'required|date',
            'duration' => 'required|numeric',
            'name' => 'required|string'
        ]);
    }
}
