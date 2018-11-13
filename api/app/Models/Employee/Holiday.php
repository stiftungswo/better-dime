<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Holiday extends Model
{
    use  SoftDeletes;

    protected $fillable = ['date', 'duration', 'name'];

    public static function paidTimeInDateRange($start, $end)
    {
        return DB::table('holidays')->whereBetween('date', [$start, $end])->sum('duration');
    }
}
