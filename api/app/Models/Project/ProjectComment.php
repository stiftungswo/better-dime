<?php

namespace App\Models\Project;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class ProjectComment extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $fillable = ['comment', 'date', 'project_id'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
