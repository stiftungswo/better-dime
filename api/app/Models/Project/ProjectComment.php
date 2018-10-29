<?php

namespace App\Models\Project;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectComment extends Model
{
    use SoftDeletes;

    protected $fillable = ['comment', 'date', 'project_id'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
