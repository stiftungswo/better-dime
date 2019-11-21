<?php

namespace App\Models\PositionGroup;

use App\Models\Service\RateUnit;
use App\Models\Service\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use RichanFongdasen\EloquentBlameable\BlameableTrait;

class PositionGroup extends Model
{
    use SoftDeletes, BlameableTrait;

    protected $fillable = ['name'];

}
