<?php

namespace App\Models\Service;

use Illuminate\Database\Eloquent\Model;

class ServiceRate extends Model
{
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
