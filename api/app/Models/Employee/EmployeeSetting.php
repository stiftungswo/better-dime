<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeeSetting extends Model
{
    use SoftDeletes;

    protected $fillable = ['employee_id'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
