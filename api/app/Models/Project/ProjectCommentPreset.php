<?php

namespace App\Models\Project;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class ProjectCommentPreset extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $fillable = ['comment_preset'];
}
