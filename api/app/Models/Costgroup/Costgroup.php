<?php

namespace App\Models\Costgroup;

use App\Models\Project\Project;
use App\Models\Project\ProjectCostgroupDistribution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Costgroup extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'number'];

    protected $primaryKey = 'number';

    public $incrementing = false;

    public function costgroup_distributions()
    {
        return $this->hasMany(ProjectCostgroupDistribution::class);
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_costgroup_distributions');
    }
}
