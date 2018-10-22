<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Employee\Employee;
use Illuminate\Support\Facades\Input;

class EmployeeController extends BaseController
{

    public function index()
    {
        return Employee::all();
    }

    public function get($id)
    {
        return Employee::findOrFail($id);
    }

    public function post()
    {
        $employee = Employee::create(Input::toArray());
        return self::get($employee->id);
    }

    public function put($id)
    {
        Employee::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    public function delete($id)
    {
        Employee::findOrFail($id)->delete();
        return "Entity deleted";
    }

    // TODO implement validation
}
