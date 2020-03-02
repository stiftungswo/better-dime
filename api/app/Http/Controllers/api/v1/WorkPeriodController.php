<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Employee\WorkPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class WorkPeriodController extends BaseController
{
    public function delete($id)
    {
        WorkPeriod::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function index(Request $request)
    {
        $this->validate($request, [
            'employee' => 'required|integer'
        ]);

        return WorkPeriod::where('employee_id', '=', Input::get('employee'))->get();
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $workPeriod = WorkPeriod::create(Input::toArray());
        return self::get($workPeriod->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        WorkPeriod::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    private function get($id)
    {
        return WorkPeriod::findOrFail($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'employee_id' => 'required|integer',
            'ending' => 'required|date',
            'pensum' => 'required|integer|min:0',
            'beginning' => 'required|date',
            'yearly_vacation_budget' => 'required|integer|min:0'
        ]);
    }
}
