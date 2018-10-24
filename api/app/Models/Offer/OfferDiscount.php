<?php

namespace App\Models\Offer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OfferDiscount extends Model
{
    use SoftDeletes;

    protected $casts = [
        'value' => 'float',
        'percentage' => 'boolean'
    ];

    protected $fillable = ['name', 'offer_id', 'percentage', 'value'];

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }
}
