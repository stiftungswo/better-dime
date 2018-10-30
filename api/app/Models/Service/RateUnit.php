<?php

namespace App\Models\Service;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;

class RateUnit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'billing_unit', 'factor', 'archived', 'effort_unit', 'is_time'
    ];

    protected $casts = [
        'archived' => 'boolean',
        'factor' => 'double',
        'is_time' => 'boolean'
    ];
}
