<?php

namespace App\Models\Invoice;

use App\Models\Customer\Address;
use App\Models\Employee\Employee;
use App\Models\Project\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use SoftDeletes;

    protected $appends = ['costgroups'];

    protected $fillable = ['accountant_id', 'address_id', 'description', 'end', 'fixed_price', 'name', 'project_id', 'start'];

    public function accountant()
    {
        return $this->belongsTo(Employee::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function discounts()
    {
        return $this->hasMany(InvoiceDiscount::class);
    }

    public function invoice_costgroups()
    {
        return $this->belongsToMany(Costgroup::class);
    }

    public function positions()
    {
        return $this->hasMany(InvoicePosition::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Magic method for the appended "costgroups" attribute
     *
     * @return array
     */
    public function getCostgroupsAttribute()
    {
        if ($this->invoice_costgroups->isEmpty()) {
            return [];
        } else {
            return $this->invoice_costgroups->map(function ($ic) {
                return $ic->number;
            })->sort()->toArray();
        }
    }
}
