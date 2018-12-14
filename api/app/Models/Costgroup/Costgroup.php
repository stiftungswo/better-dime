<?php

namespace App\Models\Costgroup;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Costgroup extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'number'];

    protected $primaryKey = 'number';

    public $incrementing = false;
}
