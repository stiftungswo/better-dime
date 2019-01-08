<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Customer\Address;
use App\Models\Customer\Company;
use App\Models\Customer\CustomerTag;
use App\Models\Customer\Phone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class CompanyController extends BaseController
{

    public function delete($id)
    {
        Company::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function duplicate($id)
    {
        $company = Company::findOrFail($id);
        return self::get($this->duplicateObject($company, ['addresses' => 'customer', 'phone_numbers' => 'customer', 'people']));
    }

    public function index()
    {
        return Company::with(['addresses'])->get();
    }

    public function get($id)
    {
        return Company::with(['addresses', 'phone_numbers'])->findOrFail($id)->append(['tags', 'persons']);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $company = Company::create(Input::toArray());

        // tags is an array of existing CustomerTag id
        foreach (Input::get('tags') as $tag) {
            /** @var CustomerTag $t */
            $t = CustomerTag::findOrFail($tag);
            $t->customers()->save($company);
        }

        foreach (Input::get('phone_numbers') as $phoneNumber) {
            /** @var Phone $pn */
            $pn = Phone::make($phoneNumber);
            $pn->customer()->associate($company);
            $pn->save();
        }

        foreach (Input::get('addresses') as $address) {
            /** @var Address $a */
            $a = Address::make($address);
            $a->customer()->associate($company);
            $a->save();
        }

        return self::get($company->id);
    }

    public function put($id, Request $request)
    {
        // input tags has to be a list of existing CustomerTag ids
        $this->validateRequest($request);
        /** @var Company $c */
        $c = Company::findOrFail($id);
        try {
            DB::beginTransaction();
            $c->update(Input::toArray());
            $c->customer_tags()->sync(Input::get('tags'));

            $this->executeNestedUpdate(Input::get('phone_numbers'), $c->phone_numbers, Phone::class, 'customer', $c);

            $this->executeNestedUpdate(Input::get('addresses'), $c->addresses, Address::class, 'customer', $c);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        DB::commit();

        return self::get($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'addresses' => 'present|array',
            'comment' => 'string|nullable',
            'chargable' => 'boolean',
            'email' => 'email|nullable|max:255',
            'hidden' => 'boolean',
            'name' => 'required|string|max:255',
            'phone_numbers' => 'present|array',
            'phone_numbers.*.category' => 'required|integer',
            'phone_numbers.*.number' => 'required|string',
            'rate_group_id' => 'required|integer',
            'tags' => 'present|array'
        ]);
    }
}
