<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Customer\Person;
use App\Models\Customer\CustomerTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class PersonController extends BaseController
{

    public function delete($id)
    {
        Person::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function index()
    {
        return Person::all();
    }

    public function get($id)
    {
        return Person::findOrFail($id);
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $person = Person::create(Input::toArray());

        // tags is an array of existing CustomerTag ids
        foreach (Input::get('tags') as $tag) {
            /** @var CustomerTag $t */
            $t = CustomerTag::findOrFail($tag);
            $t->people()->save($person);
        }

        return self::get($person->id);
    }

    public function put($id, Request $request)
    {
        // input tags has to be a list of existing CustomerTag ids
        $this->validateRequest($request);
        /** @var Person $p */
        $p = Person::findOrFail($id);
        $p->update(Input::toArray());

        if (Input::get('tags')) {
            $p->customerTags()->sync(Input::get('tags'));
        }

        return self::get($id);
    }

    private function validateRequest(Request $request)
    {
        $this->validate($request, [
            'comment' => 'string|nullable',
            'company_id' => 'integer|nullable',
            'chargable' => 'boolean',
            'department' => 'string|nullable',
            'email' => 'email|nullable|max:255',
            'first_name' => 'required|string|max:255',
            'hidden' => 'boolean',
            'last_name' => 'required|string|max:255',
            'salutation' => 'string|nullable|max:20',
            'rate_group_id' => 'required|integer',
            'tags' => 'array'
        ]);
    }
}
