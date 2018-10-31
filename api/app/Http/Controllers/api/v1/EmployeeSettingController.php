<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Employee\EmployeeSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class EmployeeSettingController extends BaseController
{
    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        EmployeeSetting::findOrFail($id)->update(Input::toArray());
        return EmployeeSetting::findOrFail($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'employee_id' => 'required|integer'
        ]);
    }
}
