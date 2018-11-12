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

    protected $fillable = ['accountant_id', 'address_id', 'description', 'end', 'fixed_price', 'name', 'project_id', 'start'];

    public function accountant()
    {
        return $this->belongsTo(Employee::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function costgroup_distributions()
    {
        return $this->hasMany(CostgroupDistribution::class);
    }

    public function discounts()
    {
        return $this->hasMany(InvoiceDiscount::class);
    }

    public function positions()
    {
        return $this->hasMany(InvoicePosition::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
