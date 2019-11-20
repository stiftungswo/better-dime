<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Employee\EmployeeGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class EmployeeGroupController extends BaseController
{
    public function delete($id)
    {
        EmployeeGroup::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function index(Request $request)
    {
        $query = $this->getFilteredQuery(EmployeeGroup::query(), $request, ['name']);
        return $query->get();
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $employeeGroup = EmployeeGroup::create(Input::toArray());
        return self::get($employeeGroup->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        EmployeeGroup::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    private function get($id)
    {
        return EmployeeGroup::findOrFail($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string'
        ]);
    }
}
