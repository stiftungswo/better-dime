<?php

namespace App\Models\Service;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class RateUnit extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $fillable = [
        'billing_unit', 'factor', 'archived', 'effort_unit', 'is_time', 'name'
    ];

    protected $casts = [
        'archived' => 'boolean',
        'factor' => 'double',
        'is_time' => 'boolean'
    ];
}
