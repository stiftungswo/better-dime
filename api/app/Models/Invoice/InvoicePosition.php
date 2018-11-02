<?php

namespace App\Models\Invoice;

use App\Models\Project\ProjectPosition;
use App\Models\Service\RateUnit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InvoicePosition extends Model
{
    use SoftDeletes;

    protected $casts = [
        'amount' => 'float'
    ];

    protected $fillable = ['amount', 'description', 'invoice_id', 'order', 'project_position_id', 'price_per_rate', 'rate_unit_id', 'vat'];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function project_position()
    {
        return $this->belongsTo(ProjectPosition::class);
    }

    public function rate_unit()
    {
        return $this->belongsTo(RateUnit::class);
    }
}
