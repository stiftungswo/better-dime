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

    public function getDropdownLabelAttribute()
    {
        $basicString = "";
        if ($this->customer) {
            if ($this->customer->company) {
                $basicString .= $this->customer->company->name . ', ';
            } elseif ($this->customer->name) {
                $basicString .= $this->customer->name . ', ';
            }
            if ($this->customer->first_name) {
                $basicString .= $this->customer->first_name . ' ' . $this->customer->last_name . ', ';
            }
        }
        $basicString .= $this->street . ', ';
        $basicString .= $this->supplement ? $this->supplement . ', ' : '';
        $basicString .= $this->postcode . ' ' . $this->city;
        $basicString .= $this->country ? ', ' . $this->country : '';
        return $basicString;
    }
}
