<?php

namespace App\Models\Project;

use App\Models\Costgroup\Costgroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class ProjectCostgroupDistribution extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $fillable = ['costgroup_number', 'project_id', 'weight'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function costgroup()
    {
        return $this->belongsTo(Costgroup::class);
    }
}
