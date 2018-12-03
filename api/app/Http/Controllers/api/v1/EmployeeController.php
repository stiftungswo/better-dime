<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Employee\Employee;
use App\Models\Employee\WorkPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        return Employee::with('work_periods')->findOrFail($id);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $employee = Employee::create(Input::toArray());

        if (Input::get('work_periods')) {
            foreach (Input::get('work_periods') as $workPeriod) {
                /** @var WorkPeriod $wp */
                $wp = WorkPeriod::make($workPeriod);
                $wp->employee()->associate($employee);
                $wp->save();
            }
        }

        return self::get($employee->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        $employee = Employee::findOrFail($id);

        try {
            DB::beginTransaction();
            $employee->update(Input::toArray());

            if (Input::get('work_periods')) {
                $this->executeNestedUpdate(Input::get('work_periods'), $employee->work_periods, WorkPeriod::class, 'employee', $employee);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        DB::commit();

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
            'holidays_per_year' => 'integer|nullable',
            'is_admin' => 'boolean',
            'last_name' => 'required|string',
            'password' => 'string',
            'work_periods.*.end' => 'required|date',
            'work_periods.*.pensum' => 'required|integer',
            'work_periods.*.start' => 'required|date',
            'work_periods.*.vacation_takeover' => 'required|numeric',
            'work_periods.*.yearly_vacation_budget' => 'required|integer',
        ]);
    }
}
