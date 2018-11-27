<?php

namespace App\Models\Customer;

use App\Models\Service\RateGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class Company extends Customer
{
    protected $appends = ['persons', 'tags'];

    protected $hidden = [
        'customer_tags', 'people'
    ];

    protected $fillable = [
        'comment', 'email', 'hidden', 'name', 'rate_group_id'
    ];

    protected static $persisted = ['name'];

    protected static $singleTableType = 'company';

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

    public function people()
    {
        return $this->hasMany(Person::class);
    }
}
