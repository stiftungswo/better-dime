<?php

namespace App\Models\Project;

use App\Models\Employee\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectEffort extends Model
{
    use SoftDeletes;

    protected $casts = [
        'value' => 'float'
    ];

    protected $fillable = ['date', 'employee_id', 'project_position_id', 'value'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function position()
    {
        return $this->belongsTo(ProjectPosition::class, 'position_id');
    }
}
