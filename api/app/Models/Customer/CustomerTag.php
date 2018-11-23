<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class CustomerTag extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $fillable = [ 'name' ];

    public function companies()
    {
        return $this->morphedByMany(Company::class, 'customer_taggable');
    }

    public function people()
    {
        return $this->morphedByMany(Person::class, 'customer_taggable');
    }
}
