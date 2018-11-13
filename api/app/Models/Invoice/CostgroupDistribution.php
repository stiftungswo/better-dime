<?php

namespace App\Models\Invoice;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CostgroupDistribution extends Model
{
    use SoftDeletes;

    protected $fillable = ['costgroup_number', 'invoice_id', 'weight'];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function costgroup()
    {
        return $this->belongsTo(Costgroup::class);
    }
}
