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
        'chargeable' => 'boolean',
        'hidden' => 'boolean',
    ];

    protected $hidden = [
        'customer_tags'
    ];

    protected $fillable = [
        'comment', 'chargeable', 'company_id', 'department', 'email', 'first_name', 'hidden', 'last_name', 'rate_group_id', 'salutation'
    ];

    /**
     * Magic method for the appended "tags" attribute
     *
     * @return array
     */
    public function getTagsAttribute()
    {
        if ($this->customerTags->isEmpty()) {
            return [];
        } else {
            return $this->customerTags->map(function ($t) {
                return $t->id;
            })->toArray();
        }
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function rateGroup()
    {
        return $this->belongsTo(RateGroup::class);
    }

    public function customerTags()
    {
        return $this->morphToMany(CustomerTag::class, 'customer_taggable');
    }
}
