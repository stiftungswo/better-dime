<?php

namespace App\Models\Project;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class ProjectCategory extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $casts = [
        'archived' => 'boolean'
    ];

    protected $fillable = ['archived', 'name'];
}
