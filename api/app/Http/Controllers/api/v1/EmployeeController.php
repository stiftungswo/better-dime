<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Employee\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class EmployeeController extends BaseController
{
    public function archive($id, Request $request)
    {
        $employee = Employee::findOrFail($id);
        return self::doArchive($employee, $request);
    }

    public function index()
    {
        return Employee::all();
    }

    public function get($id)
    {
        return Employee::findOrFail($id);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $employee = Employee::create(Input::toArray());
        return self::get($employee->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        Employee::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    public function duplicate($id)
    {
        $employee = Employee::findOrFail($id);
        $randomNumber = rand(1000, 9999);
        return self::get($this->duplicateObject(
            $employee,
            [],
            [],
            ['email' => str_slug(strtolower($employee->first_name) . strtolower($employee->last_name) . $randomNumber) . '@swo.ch']
        ));
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'archived' => 'boolean',
            'can_login' => 'boolean',
            'email' => 'required|email',
            'first_name' => 'required|string',
            'holidays_per_year' => 'required|integer',
            'is_admin' => 'boolean',
            'last_name' => 'required|string',
            'password' => 'string'
        ]);
    }
}
