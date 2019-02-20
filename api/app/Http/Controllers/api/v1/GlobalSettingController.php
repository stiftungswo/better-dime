<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\GlobalSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class GlobalSettingController extends BaseController
{
    public function index()
    {
        return GlobalSettings::all()->first();
    }

    public function put(Request $request)
    {
        $this->validateRequest($request);
        $settings = GlobalSettings::all()->first();
        $settings->update(Input::toArray());
        return $settings;
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'sender_name' => 'required|string|max:255',
            'sender_street' => 'required|string|max:255',
            'sender_zip' => 'required|string|max:255',
            'sender_city' => 'required|string|max:255',
            'sender_phone' => 'required|string|max:255',
            'sender_mail' => 'required|string|max:255',
            'sender_vat' => 'required|string|max:255',
            'sender_bank' => 'required|string|max:255',
            'sender_web' => 'required|string|max:255',
            'sender_bank_iban' => 'required|string|max:255',
            'sender_bank_bic' => 'required|string|max:255',
            'sender_bank_detail' => 'required|string|max:255',
            'service_order_comment' => 'required|string|max:4000',
        ]);
    }
}
