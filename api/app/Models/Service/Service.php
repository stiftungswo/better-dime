<?php

namespace App\Models\Service;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;

class Service extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'description', 'vat', 'archived'
    ];

    protected $casts = [
        'archived' => 'boolean'
    ];

    public function serviceRates()
    {
        return $this->hasMany(ServiceRate::class);
    }
}
