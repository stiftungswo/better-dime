<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Employee\Employee;
use App\Models\Employee\WorkPeriod;
use App\Models\Project\ProjectEffort;
use App\Services\PDF\PDF;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Validation\Rule;

class EmployeeController extends BaseController
{
    public function archive($id, Request $request)
    {
        $employee = Employee::findOrFail($id);
        return self::doArchive($employee, $request);
    }

    public function index(Request $request)
    {
        $query = $this->getFilteredQuery(Employee::query(), $request, ['id', 'first_name', 'last_name', 'email']);
        return $this->getPaginatedQuery($query, $request);
    }

    public function get($id)
    {
        return Employee::with('work_periods')->findOrFail($id);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $employee = Employee::create(Input::toArray());

        foreach (Input::get('work_periods') as $workPeriod) {
            /** @var WorkPeriod $wp */
            $wp = WorkPeriod::make($workPeriod);
            $wp->employee()->associate($employee);
            $wp->save();
        }

        return self::get($employee->id);
    }

    public function printEffortReport($id, Request $request)
    {
        $validatedData = $this->validate($request, [
            'end' => 'required|date',
            'start' => 'required|date'
        ]);
        $employee = Employee::findOrFail($id);

        $projectEfforts = ProjectEffort::with(['position', 'position.service', 'position.rate_unit', 'position.project'])
            ->where([
            ['date', '>=', $validatedData['start']],
            ['date', '<=', $validatedData['end']],
            ['employee_id', '=', $id]
            ])->get();

        $effortsPerDate = [];
        $totalHours = 0;

        $projectEfforts->each(function ($e) use (&$effortsPerDate, &$totalHours) {
            if (!array_key_exists($e->date, $effortsPerDate)) {
                $effortsPerDate[$e->date] = [];
            }
            $effortsPerDate[$e->date][] = $e;

            if ($e->position->rate_unit->is_time) {
                $totalHours += $e->value;
            }
        });

        ksort($effortsPerDate);

        // initialize PDF, render view and pass it back
        $pdf = new PDF(
            'employee_effort_report',
            [
                'content' => $effortsPerDate,
                'employee' => $employee,
                'end' => $validatedData['end'],
                'start' => $validatedData['start'],
                'total_hours' => $totalHours
            ]
        );

        return $pdf->print("Aufwandrapport $employee->name", Carbon::parse($validatedData['start']), Carbon::parse($validatedData['end']));
    }

    public function put($id, Request $request)
    {
        $employee = Employee::findOrFail($id);
        $this->validateRequest($request, $employee);

        try {
            DB::beginTransaction();
            $employee->update(Input::toArray());

            $this->executeNestedUpdate(Input::get('work_periods'), $employee->work_periods, WorkPeriod::class, 'employee', $employee);
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

    private function validateRequest(Request $request, Employee $employee = null)
    {
        $this->validate($request, [
            'archived' => 'boolean',
            'can_login' => 'boolean',
            'email' => [
                'required',
                'email',
                Rule::unique('employees')->ignore($employee),
            ],
            'first_name' => 'required|string',
            'holidays_per_year' => 'integer|nullable',
            'is_admin' => 'boolean',
            'last_name' => 'required|string',
            'encrypted_password' => 'string',
            'first_vacation_takeover' => 'required|numeric',
            'work_periods' => 'present|array',
            'work_periods.*.end' => 'required|date',
            'work_periods.*.pensum' => 'required|integer',
            'work_periods.*.start' => 'required|date',
            'work_periods.*.yearly_vacation_budget' => 'required|integer',
        ], [
            'email.unique' => 'Die gewählte Email Adresse ist bereits vergeben.',
            'email.email' => 'Die gewählte Email Adresse ist nicht gültig.'
        ]);
    }
}
