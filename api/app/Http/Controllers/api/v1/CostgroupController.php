<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Invoice\Costgroup;

class CostgroupController extends BaseController
{

    public function index()
    {
        return Costgroup::all();
    }
}
