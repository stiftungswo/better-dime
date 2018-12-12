<?php

namespace App\Models\Invoice;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class InvoiceDiscount extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $casts = [
        'percentage' => 'boolean',
        'value' => 'float'
    ];

    protected $fillable = ['invoice_id', 'name', 'percentage', 'value'];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
