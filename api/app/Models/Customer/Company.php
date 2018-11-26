<?php

namespace App\Models\Customer;

use App\Models\Service\RateGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class Company extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $appends = ['tags', 'persons'];

    protected $casts = [
        'hidden' => 'boolean',
    ];

    protected $hidden = [
        'customer_tags', 'people'
    ];

    protected $fillable = [
        'comment', 'email', 'hidden', 'name', 'rate_group_id'
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

    /**
     * Magic method for the appended "people" attribute
     *
     * @return array
     */
    public function getPersonsAttribute()
    {
        if ($this->people->isEmpty()) {
            return [];
        } else {
            return $this->people->map(function ($p) {
                return $p->id;
            })->toArray();
        }
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'customer');
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

    public function delete()
    {
        foreach ($this->addresses as $address) {
            $address->delete();
        }

        foreach ($this->phone_numbers as $phone) {
            $phone->delete();
        }

        parent::delete();
    }
}
