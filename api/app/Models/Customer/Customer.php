<?php

namespace App\Models\Customer;

use Askedio\SoftCascade\Traits\SoftCascadeTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nanigans\SingleTableInheritance\SingleTableInheritanceTrait;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class Customer extends Model
{
    use SingleTableInheritanceTrait, SoftDeletes, BlameableTrait, SoftCascadeTrait;

    protected $casts = [
        'hidden' => 'boolean',
    ];

    protected $table = "customers";

    protected static $singleTableTypeField = 'type';

    protected static $singleTableSubclasses = [Company::class, Person::class];

    protected static $persisted = ['comment', 'email', 'hidden', 'rate_group_id'];

    public function addresses()
    {
        return $this->hasMany(Address::class, 'customer_id');
    }

    public function customer_tags()
    {
        return $this->belongsToMany(CustomerTag::class, 'customer_taggable', 'customer_id');
    }

    public function rate_group()
    {
        return $this->belongsTo(\App\Models\Service\RateGroup::class, 'rate_group_id');
    }

    public function phone_numbers()
    {
        return $this->hasMany(Phone::class, 'customer_id');
    }

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
}
