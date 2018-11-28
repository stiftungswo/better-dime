<?php

namespace App\Models\Customer;

use App\Models\Service\RateGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class Person extends Customer
{
    protected $hidden = [
        'customer_tags'
    ];

    protected $fillable = [
        'comment', 'company_id', 'department', 'email', 'first_name', 'hidden', 'last_name', 'rate_group_id', 'salutation'
    ];

    protected $softCascade = ['addresses', 'phone_numbers'];

    protected static $persisted = ['company_id', 'department', 'first_name', 'last_name', 'salutation'];

    protected static $singleTableType = 'person';

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
