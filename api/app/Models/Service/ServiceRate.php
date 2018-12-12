<?php

namespace App\Models\Service;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class ServiceRate extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $fillable = [
        'value', 'rate_group_id', 'service_id', 'rate_unit_id'
    ];

    public function rate_group()
    {
        return $this->belongsTo(RateGroup::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function rate_unit()
    {
        return $this->belongsTo(RateUnit::class);
    }
}
