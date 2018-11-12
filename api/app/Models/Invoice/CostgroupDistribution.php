<?php

namespace App\Models\Invoice;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CostgroupDistribution extends Model
{
    use SoftDeletes;

    protected $appends = ['ratio'];

    protected $fillable = ['costgroup_number', 'invoice_id', 'weight'];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function costgroup()
    {
        return $this->belongsTo(Costgroup::class);
    }

    public function getRatioAttribute()
    {
        $sum = $this->invoice->costgroup_distributions->sum('weight');
        return round(($this->weight / $sum) * 100, 0);
    }
}
