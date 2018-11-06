<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Customer\Address;

class AddressController extends BaseController
{
    public function index()
    {
        return Address::all()->each->append('dropdown_label');
    }
}
