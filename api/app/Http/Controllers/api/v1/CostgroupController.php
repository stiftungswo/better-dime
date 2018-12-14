<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Costgroup\Costgroup;

class CostgroupController extends BaseController
{

    public function index()
    {
        return Costgroup::all();
    }
}
