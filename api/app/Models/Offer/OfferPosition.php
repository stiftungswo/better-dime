<?php

namespace App\Models\Offer;

use App\Models\PositionGroup\PositionGroup;
use App\Models\Service\RateUnit;
use App\Models\Service\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class OfferPosition extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $casts = [
        'amount' => 'float',
    ];

    protected $fillable = [
        'amount', 'description', 'offer_id', 'order', 'price_per_rate',
        'rate_unit_id', 'service_id', 'position_group_id', 'vat'];

    protected $appends = ['rate_unit_archived'];

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    public function rate_unit()
    {
        return $this->belongsTo(RateUnit::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function position_group()
    {
        return $this->belongsTo(PositionGroup::class);
    }

    /**
     * Returns the multiplication of amount and price_per_rate, if both values are numeric
     * @return float|int
     */
    public function getCalculatedTotalAttribute()
    {
        if (is_numeric($this->price_per_rate) && is_numeric($this->amount)) {
            return $this->price_per_rate * $this->amount;
        } else {
            return 0;
        }
    }

    /**
     * Returns the whether or not the rate unit that is used for this position is archived
     * @return string
     */
    public function getRateUnitArchivedAttribute()
    {
        return $this->rate_unit->archived;
    }

    /**
     * Returns amount of this position if associated rate unit is a time unit
     * @return float
     */
    public function estimatedWorkHours()
    {
        if ($this->rate_unit->is_time) {
            return $this->amount*$this->rate_unit->factor;
        } else {
            return 0;
        }
    }
}
