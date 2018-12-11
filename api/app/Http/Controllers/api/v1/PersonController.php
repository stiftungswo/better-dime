<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Models\Customer\Address;
use App\Models\Customer\CustomerTag;
use App\Models\Customer\Person;
use App\Models\Customer\Phone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

class PersonController extends BaseController
{

    public function delete($id)
    {
        Person::findOrFail($id)->delete();
        return 'Entity deleted';
    }

    public function duplicate($id)
    {
        $person = Person::findOrFail($id);
        return self::get($this->duplicateObject($person, ['addresses' => 'customer', 'phone_numbers' => 'customer']));
    }

    public function index()
    {
        return Person::with(['company'])->get();
    }

    public function get($id)
    {
        return Person::with(['addresses', 'phone_numbers'])->findOrFail($id)->append('tags');
    }

    public function post(Request $request)
    {
        $this->validateRequest($request);
        $person = Person::create(Input::toArray());

        // tags is an array of existing CustomerTag ids
        if (Input::get('tags')) {
            foreach (Input::get('tags') as $tag) {
                /** @var CustomerTag $t */
                $t = CustomerTag::findOrFail($tag);
                $t->customers()->save($person);
            }
        }

        if (Input::get('phone_numbers')) {
            foreach (Input::get('phone_numbers') as $phoneNumber) {
                /** @var Phone $pn */
                $pn = Phone::make($phoneNumber);
                $pn->customer()->associate($person);
                $pn->save();
            }
        }

        if (Input::get('addresses')) {
            foreach (Input::get('addresses') as $address) {
                /** @var Address $a */
                $a = Address::make($address);
                $a->customer()->associate($person);
                $a->save();
            }
        }

        return self::get($person->id);
    }

    public function put($id, Request $request)
    {
        // input tags has to be a list of existing CustomerTag ids
        $this->validateRequest($request);

        /** @var Person $p */
        $p = Person::findOrFail($id);
        try {
            DB::beginTransaction();
            $p->update(Input::toArray());

            if (Input::get('tags')) {
                $p->customer_tags()->sync(Input::get('tags'));
            }

            if (Input::get('phone_numbers')) {
                $this->executeNestedUpdate(Input::get('phone_numbers'), $p->phone_numbers, Phone::class, 'customer', $p);
            }

            if (Input::get('addresses')) {
                $this->executeNestedUpdate(Input::get('addresses'), $p->addresses, Address::class, 'customer', $p);
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
            'addresses' => 'array',
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
