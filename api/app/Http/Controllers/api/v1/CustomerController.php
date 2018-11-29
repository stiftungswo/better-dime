<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Customer\Customer;
use App\Models\Customer\Person;

class CustomerController extends BaseController
{

    public function index()
    {
        return Customer::all();
    }

    public function get($id)
    {
        $customer = Customer::with(['addresses'])->findOrFail($id);
        $response = $customer->toArray();
        if ($customer->type === "person" && $customer->company) {
            $response['addresses'] = $customer->addresses->merge($customer->company->addresses);
        }
        return $response;
    }
}
