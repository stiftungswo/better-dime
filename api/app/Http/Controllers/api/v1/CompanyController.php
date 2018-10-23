<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
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

    public function index()
    {
        return Company::with('phone_numbers')->get();
    }

    public function get($id)
    {
        return Company::with('phone_numbers')->findOrFail($id);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $company = Company::create(Input::toArray());

        // tags is an array of existing CustomerTag id
        if (Input::get('tags')) {
            foreach (Input::get('tags') as $tag) {
                /** @var CustomerTag $t */
                $t = CustomerTag::findOrFail($tag);
                $t->companies()->save($company);
            }
        }

        if (Input::get('phone_numbers')) {
            foreach (Input::get('phone_numbers') as $phoneNumber) {
                $pn = Phone::make($phoneNumber);
                $pn->customer()->associate($company);
                $pn->save();
            }
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

            if (Input::get('tags')) {
                $c->customer_tags()->sync(Input::get('tags'));
            }

            if (Input::get('phone_numbers')) {
                $this->executeNestedUpdate(Input::get('phone_numbers'), $c->phone_numbers, Phone::class, 'customer', $c);
            }
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
            'comment' => 'string|nullable',
            'chargable' => 'boolean',
            'email' => 'email|nullable|max:255',
            'hidden' => 'boolean',
            'name' => 'required|string|max:255',
            'phone_numbers' => 'array',
            'rate_group_id' => 'required|integer',
            'tags' => 'array'
        ]);
    }
}
