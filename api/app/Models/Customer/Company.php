<?php

namespace App\Models\Customer;

use App\Models\Service\RateGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;

    protected $appends = ['tags'];

    protected $casts = [
        'chargeable' => 'boolean',
        'hidden' => 'boolean',
    ];

    protected $hidden = [
        'customer_tags'
    ];

    protected $fillable = [
        'comment', 'chargeable', 'email', 'hidden', 'name', 'rate_group_id'
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

    public function customer_tags()
    {
        return $this->morphToMany(CustomerTag::class, 'customer_taggable');
    }

    public function people()
    {
        return $this->hasMany(Person::class);
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
