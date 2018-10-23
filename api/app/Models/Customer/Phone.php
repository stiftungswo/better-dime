<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Phone extends Model
{
    use SoftDeletes;

    /* the numbers for the different categories are going as follow:
    1: Hauptnummer
    2: Direktwahl
    3: Privat
    4: Mobile
    5: Fax
     */

    protected $hidden = ['customer_id', 'customer_type'];

    protected $fillable = ['category', 'customer_id', 'customer_type', 'number'];

    public function customer()
    {
        return $this->morphTo();
    }
}
