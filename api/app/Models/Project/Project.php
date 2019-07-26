<?php

namespace App\Models\Project;

use App\Models\Customer\Address;
use App\Models\Customer\Customer;
use App\Models\Employee\Employee;
use App\Models\Invoice\Invoice;
use App\Models\Offer\Offer;
use App\Models\Service\RateGroup;
use App\Services\CostBreakdown;
use Askedio\SoftCascade\Traits\SoftCascadeTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class Project extends Model
{
    use SoftDeletes, BlameableTrait, SoftCascadeTrait;

    protected $softCascade = ['comments', 'costgroup_distributions', 'efforts', 'positions'];

    protected $casts = [
        'archived' => 'boolean',
        'chargeable' => 'boolean',
        'vacation_project' => 'boolean',
    ];

    protected $fillable = [
        'accountant_id', 'address_id', 'customer_id', 'archived', 'chargeable', 'category_id', 'deadline',
        'description', 'fixed_price', 'vacation_project', 'name', 'offer_id',
        'project_category_id', 'rate_group_id'
    ];

    protected $hidden = ['efforts', 'offer', 'invoices'];

    public function accountant()
    {
        return $this->belongsTo(Employee::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function category()
    {
        return $this->belongsTo(ProjectCategory::class);
    }

    public function comments()
    {
        return $this->hasMany(ProjectComment::class);
    }

    public function costgroup_distributions()
    {
        return $this->hasMany(ProjectCostgroupDistribution::class);
    }

    public function efforts()
    {
        return $this->hasManyThrough(ProjectEffort::class, ProjectPosition::class, 'project_id', 'position_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    public function positions()
    {
        return $this->hasMany(ProjectPosition::class)->orderBy('order', 'asc');
    }

    public function rate_group()
    {
        return $this->belongsTo(RateGroup::class);
    }

    public function getInvoiceIdsAttribute()
    {
        return $this->invoices->map(function ($i) {
            return $i->id;
        });
    }

    /**
     * Returns the budget for the project based on a few factors:
     * 1. if project has no associated offer, it returns null
     * 2. if the offer of the project has a fixed price set, it returns the fixed price
     * 3. else, calculate the subtotal of the offer through the Breakdown (this is before any discount and VAT are applied)
     * @return null|integer
     */
    public function getBudgetPriceAttribute()
    {
        if (is_null($this->offer)) {
            return null;
        } else {
            if (is_null($this->offer->fixed_price)) {
                return CostBreakdown::calculate($this->offer)['total'];
            } else {
                return $this->offer->fixed_price;
            }
        }
    }

    /**
     * Returns the time budget for the project:
     * 1. if project has no associated offer, it returns null
     * 2. else, calculate the estimated workhours for each offer position and return this result
     * @return float|int|null
     */
    public function getBudgetTimeAttribute()
    {
        if (is_null($this->offer)) {
            return null;
        } else {
            $budgetTime = 0;

            foreach ($this->offer->positions as $position) {
                /** @var \App\Models\Offer\OfferPosition $position */
                $budgetTime += $position->estimatedWorkHours();
            }

            return $budgetTime;
        }
    }

    /**
     * Returns the current costs for this project (based on the rates of each position)
     * @return int
     */
    public function getCurrentPriceAttribute()
    {
        $price = 0;

        foreach ($this->positions as $position) {
            $price += $position->charge;
        }

        return $price;
    }

    /**
     * Returns the current recorded time efforts in minutes
     * @return int
     */
    public function getCurrentTimeAttribute()
    {
        $duration = 0;

        foreach ($this->positions as $position) {
            if (!is_null($position->rate_unit) && $position->rate_unit->is_time) {
                /** @var \App\Models\Project\ProjectPosition $position */
                $duration += $position->efforts_value;
            }
        }

        return $duration;
    }

    /**
     * Determines if the project can be deleted according to the specification of the following ticket:
     * https://github.com/stiftungswo/Dime/issues/140
     * @return bool
     */
    public function getDeletableAttribute()
    {
        return $this->efforts->isEmpty() && $this->invoices->isEmpty();
    }

    /**
     * Returns the distribution of the costgroups of this project
     */
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
