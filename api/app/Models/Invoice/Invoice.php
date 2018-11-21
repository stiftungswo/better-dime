<?php

namespace App\Models\Invoice;

use App\Models\Customer\Address;
use App\Models\Employee\Employee;
use App\Models\Project\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use SoftDeletes;

    protected $fillable = ['accountant_id', 'address_id', 'description', 'end', 'fixed_price', 'name', 'order', 'price_per_rate', 'project_id', 'rate_unit_id', 'start'];

    public function accountant()
    {
        return $this->belongsTo(Employee::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function costgroup_distributions()
    {
        return $this->hasMany(CostgroupDistribution::class);
    }

    public function discounts()
    {
        return $this->hasMany(InvoiceDiscount::class);
    }

    public function offer()
    {
        return $this->project->offer();
    }

    public function positions()
    {
        return $this->hasMany(InvoicePosition::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    
    public function getBreakdownAttribute()
    {
        return \App\Services\CostBreakdown::calculate($this);
    }

    /*
     * Returns the offer id for the current Invoice (used for the navigation in frontend)
     */
    public function getOfferIdAttribute()
    {
        if (is_null($this->project)) {
            return null;
        } else {
            if (!is_null($this->project->offer_id)) {
                return $this->project->offer_id;
            }
        }
    }



    public function getDistributionOfCostgroupsAttribute()
    {
        if ($this->costgroup_distributions->isEmpty()) {
            return [];
        } else {
            $sum = $this->costgroup_distributions->sum('weight');

            return $this->costgroup_distributions->map(function ($cd) use ($sum) {
                return [
                    "costgroup_number" => $cd->costgroup_number,
                    "ratio" => round($cd->weight / $sum * 100, 0)
                ];
            });
        }
    }
}
