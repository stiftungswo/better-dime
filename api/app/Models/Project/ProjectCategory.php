<?php

namespace App\Models\Project;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectCategory extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];
}
