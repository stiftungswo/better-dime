<?php

namespace App\Models\Project;

use App\Models\Service\RateUnit;
use App\Models\Service\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectPosition extends Model
{
    use SoftDeletes;

    protected $casts = [
        'vat' => 'float'
    ];

    protected $fillable = ['description', 'price_per_rate', 'project_id', 'rate_unit_id', 'service_id', 'vat'];

    public function efforts()
    {
        return $this->hasMany(ProjectEffort::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function rate_unit()
    {
        return $this->belongsTo(RateUnit::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
