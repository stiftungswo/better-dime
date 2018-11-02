<?php

namespace App\Models\Customer;

use App\Models\Service\RateGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Person extends Model
{
    use SoftDeletes;

    protected $appends = ['tags'];

    protected $casts = [
        'hidden' => 'boolean',
    ];

    protected $hidden = [
        'customer_tags'
    ];

    protected $fillable = [
        'comment', 'company_id', 'department', 'email', 'first_name', 'hidden', 'last_name', 'rate_group_id', 'salutation'
    ];

    /**
     * Magic method for the appended "tags" attribute
     *
     * @return array
     */
    public function getTagsAttribute()
    {
        if ($this->customer_tags->isEmpty()) {
            return [];
        } else {
            return $this->customer_tags->map(function ($t) {
                return $t->id;
            })->toArray();
        }
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'customer');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function customer_tags()
    {
        return $this->morphToMany(CustomerTag::class, 'customer_taggable');
    }

    public function phone_numbers()
    {
        return $this->morphMany(Phone::class, 'customer');
    }

    public function rateGroup()
    {
        return $this->belongsTo(RateGroup::class);
    }
}
