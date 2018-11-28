<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class CustomerTag extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $casts = [
        'archived' => 'boolean'
    ];

    protected $fillable = ['archived', 'name' ];

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_taggable');
    }
}
