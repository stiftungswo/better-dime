<?php

namespace App\Models\Project;

use App\Models\Customer\Address;
use App\Models\Employee\Employee;
use App\Models\Offer\Offer;
use App\Models\Service\RateGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $appends = ['current_price', 'current_time'];

    protected $casts = [
        'archived' => 'boolean',
        'chargeable' => 'boolean'
    ];

    protected $fillable = [
        'accountant_id', 'address_id', 'archived', 'budget_price', 'budget_time', 'chargeable',
        'category_id', 'deadline', 'description', 'fixed_price', 'vacation_project',
        'name', 'offer_id', 'project_category_id', 'rate_group_id', 'started_at',
        'stopped_at'];

    public function accountant()
    {
        return $this->belongsTo(Employee::class);
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

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    public function positions()
    {
        return $this->hasMany(ProjectPosition::class);
    }

    public function rate_group()
    {
        return $this->belongsTo(RateGroup::class);
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
                $duration += $position->effortsValueSum();
            }
        }

        return $duration;
    }
}
