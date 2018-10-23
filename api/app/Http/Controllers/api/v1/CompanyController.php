<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Customer\Company;
use App\Models\Customer\CustomerTag;
use Illuminate\Http\Request;
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
        return Company::all();
    }

    public function get($id)
    {
        return Company::findOrFail($id);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $company = Company::create(Input::toArray());

        // tags is an array of existing CustomerTag ids
        foreach (Input::get('tags') as $tag) {
            /** @var CustomerTag $t */
            $t = CustomerTag::findOrFail($tag);
            $t->companies()->save($company);
        }

        return self::get($company->id);
    }

    public function put($id, Request $request)
    {
        // input tags has to be a list of existing CustomerTag ids
        $this->validateRequest($request);
        /** @var Company $c */
        $c = Company::findOrFail($id);
        $c->update(Input::toArray());

        if (Input::get('tags')) {
            $c->customerTags()->sync(Input::get('tags'));
        }

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
            'rate_group_id' => 'required|integer',
            'tags' => 'array'
        ]);
    }
}
