<?php

namespace App\Models\Service;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class Service extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $fillable = [
        'name', 'description', 'vat', 'archived'
    ];

    protected $casts = [
        'archived' => 'boolean'
    ];

    public function service_rates()
    {
        return $this->hasMany(ServiceRate::class);
    }
}
