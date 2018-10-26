<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Service\RateGroup;

class RateGroupController extends BaseController
{

    public function index()
    {
        return RateGroup::all();
    }
}
