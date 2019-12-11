<?php

namespace App\Models\Invoice;

use App\Models\PositionGroup\PositionGroup;
use App\Models\Project\ProjectPosition;
use App\Models\Service\RateUnit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class InvoicePosition extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $casts = [
        'amount' => 'float',
        'vat' => 'float'
    ];

    protected $fillable = [
        'amount', 'description', 'invoice_id', 'order', 'project_position_id',
        'price_per_rate', 'rate_unit_id', 'position_group_id', 'vat'
    ];

    protected $appends = ['rate_unit_archived'];

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

    public function position_group()
    {
        return $this->belongsTo(PositionGroup::class);
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
}
