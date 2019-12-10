<?php

namespace App\Models\Offer;

use App\Models\Customer\Address;
use App\Models\Customer\Customer;
use App\Models\Employee\Employee;
use App\Models\Project\Project;
use App\Models\Service\RateGroup;
use Askedio\SoftCascade\Traits\SoftCascadeTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class Offer extends Model
{
    use SoftDeletes, BlameableTrait, SoftCascadeTrait;

    protected $fillable = ['accountant_id', 'address_id', 'customer_id', 'description', 'fixed_price', 'name', 'short_description', 'rate_group_id', 'status'];

    protected $softCascade = ['discounts', 'positions'];

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

    public function discounts()
    {
        return $this->hasMany(OfferDiscount::class);
    }

    public function positions()
    {
        return $this->hasMany(OfferPosition::class)->orderBy('order', 'asc');
    }

    public function project()
    {
        return $this->hasOne(Project::class);
    }

    public function rate_group()
    {
        return $this->belongsTo(RateGroup::class);
    }

    public function getBreakdownAttribute()
    {
        return \App\Services\CostBreakdown::calculate($this);
    }

    /**
     * Returns the project id for the current Offer (used for the navigation in frontend)
     * @return number
     */
    public function getProjectIdAttribute()
    {
        if (is_null($this->project)) {
            return null;
        } else {
            return $this->project->id;
        }
    }

    /**
     * Returns the position groupings associated with this project
     */
    public function getPositionGroupingsAttribute()
    {
        $groups = [];

        foreach ($this->positions as $position) {
            if (!is_null($position->position_group)) {
                $filtered = array_first($groups, function ($e) use ($position) {
                    return $e->id === $position->position_group->id;
                });

                if (is_null($filtered)) {
                    array_push($groups, $position->position_group);
                }
            }
        }

        return $groups;
    }

    /**
     * Returns the invoices for the current Offer (used for the navigation in frontend)
     * @return array
     */
    public function getInvoiceIdsAttribute()
    {
        if (is_null($this->project)) {
            return [];
        } else {
            return $this->project->invoices->map(function ($i) {
                return $i->id;
            });
        }
    }
}
