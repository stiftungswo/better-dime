<?php

namespace App\Models\Project;

use App\Models\Employee\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class ProjectEffort extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $casts = [
        'value' => 'float'
    ];

    protected $fillable = ['date', 'employee_id', 'position_id', 'value'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function position()
    {
        return $this->belongsTo(ProjectPosition::class, 'position_id');
    }

    public function getProjectIdAttribute()
    {
        if ($this->position) {
            if ($this->position->project) {
                return $this->position->project->id;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    public function getServiceAttribute()
    {
        return $this->position->service;
    }
}
