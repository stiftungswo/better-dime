<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class Phone extends Model
{
    use SoftDeletes, BlameableTrait;

    /* the numbers for the different categories are going as follow:
    1: Hauptnummer
    2: Direktwahl
    3: Privat
    4: Mobile
    5: Fax
     */

    protected $hidden = ['customer'];

    protected $fillable = ['category', 'customer_id', 'number'];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
