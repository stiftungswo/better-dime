<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Customer\CustomerTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class CustomerTagController extends BaseController
{
    public function archive($id, Request $request)
    {
        $customerTag = CustomerTag::findOrFail($id);
        return self::doArchive($customerTag, $request);
    }

    public function index()
    {
        return CustomerTag::all();
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $customerTag = CustomerTag::create(Input::toArray());
        return self::get($customerTag->id);
    }

    public function put($id, Request $request)
    {
        $this->validateRequest($request);
        CustomerTag::findOrFail($id)->update(Input::toArray());
        return self::get($id);
    }

    private function get($id)
    {
        return CustomerTag::findOrFail($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
        ]);
    }
}
