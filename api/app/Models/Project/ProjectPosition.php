<?php

namespace App\Models\Project;

use App\Models\Invoice\InvoicePosition;
use App\Models\Service\RateUnit;
use App\Models\Service\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectPosition extends Model
{
    use SoftDeletes;

    protected $appends = ['charge', 'calculated_vat'];

    protected $casts = [
        'vat' => 'float'
    ];

    protected $fillable = ['description', 'price_per_rate', 'project_id', 'rate_unit_id', 'service_id', 'vat'];

    public function efforts()
    {
        return $this->hasMany(ProjectEffort::class, 'position_id');
    }

    public function invoice_positions()
    {
        return $this->hasMany(InvoicePosition::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function rate_unit()
    {
        return $this->belongsTo(RateUnit::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Returns the total costs of this position, including VAT
     * @return float
     */
    public function getChargeAttribute()
    {
        $total = 0;

        if ($this->effortsValueSum() != 0) {
            $total = $this->price_per_rate * $this->effortsValueSum();
        }

        $total += $this->calculated_vat;

        return $total;
    }

    /**
     * Returns the sum of all efforts for this position
     * @return float
     */
    public function effortsValueSum()
    {
        return $this->efforts->map(function ($e) {
            /** @var ProjectEffort $e */
            return $e->value;
        })->sum();
    }

    /**
     * Returns the amount of vat for the current position
     * @return float
     */
    public function getCalculatedVatAttribute()
    {
        return $this->price_per_rate * $this->effortsValueSum() * $this->vat;
    }
}
