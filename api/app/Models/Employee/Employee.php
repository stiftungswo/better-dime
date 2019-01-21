<?php

namespace App\Models\Employee;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;

class Employee extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'is_admin', 'email', 'first_name', 'last_name', 'can_login', 'archived', 'holidays_per_year', 'password', 'employee_group_id'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Probably casts attributes to the given data type
     * @var array $casts
     */
    protected $casts = [
        'archived' => 'boolean',
        'can_login' => 'boolean',
        'is_admin' => 'boolean'
    ];

    protected $appends = ['group_name'];

    public function setPasswordAttribute($value)
    {
        if (!$value) {
            return;
        }

        $this->attributes['password'] = app('hash')->make($value);
    }

    public function settings()
    {
        return $this->hasOne(EmployeeSetting::class);
    }

    public function group()
    {
        return $this->belongsTo(EmployeeGroup::class, "employee_group_id");
    }

    public function work_periods()
    {
        return $this->hasMany(WorkPeriod::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . " " . $this->last_name;
    }

    public function getGroupNameAttribute()
    {
        return $this->group ? $this->group->name : "";
    }
}
