<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    use SoftDeletes;

    protected $hidden = ['customer_id', 'customer_type'];

    protected $fillable = ['city', 'country', 'description', 'postcode', 'street', 'supplement'];

    public function customer()
    {
        return $this->morphTo();
    }
}
