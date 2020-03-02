<?php

namespace App\Services\Creator;

use App\Models\Customer\Address;
use App\Models\Customer\Company;
use App\Models\Customer\CustomerTag;
use App\Models\Customer\Person;
use App\Models\Customer\Phone;
use Illuminate\Support\Facades\DB;

class CreateCustomersFromImport
{
    /**
     * @param int $rate_group_id
     * @param bool $hidden
     * @param array $customers
     * @param array $customerTags
     * @throws \Exception
     */
    public static function create(int $rate_group_id, bool $hidden, array $customers, array $customerTags = [])
    {
        DB::beginTransaction();

        try {
            foreach ($customers as $customerData) {
                $newCustomer = $customerData['type'] == 'company' ? new Company($customerData) : new Person($customerData);
                $newCustomer->hidden = $hidden;
                $newCustomer->rate_group_id = $rate_group_id;

                if ($customerData['type'] == 'person' && !empty($customerData['name'])) {
                    $company = Company::where('name', '=', $customerData['name'])->first();
                    $newCustomer->company()->associate($company);
                }

                $newCustomer->save();

                foreach ($customerTags as $customerTagId) {
                    $t = CustomerTag::findOrFail($customerTagId);
                    $t->customers()->save($newCustomer);
                }

                if (!empty($customerData['street'])) {
                    Address::create([
                        'city' => $customerData['city'],
                        'country' => $customerData['country'],
                        'customer_id' => $newCustomer->id,
                        'zip' => $customerData['zip'],
                        'street' => $customerData['street'],
                        'supplement' => $customerData['supplement'],
                    ]);
                }

                if (!empty($customerData['main_number'])) {
                    Phone::create([
                        'category' => $customerData['type'] == 'company' ? 1 : 3,
                        'customer_id' => $newCustomer->id,
                        'number' => $customerData['main_number']
                    ]);
                }

                if (!empty($customerData['fax'])) {
                    Phone::create([
                        'category' => 5,
                        'customer_id' => $newCustomer->id,
                        'number' => $customerData['fax']
                    ]);
                }

                if (!empty($customerData['mobile_number'])) {
                    Phone::create([
                        'category' => 4,
                        'customer_id' => $newCustomer->id,
                        'number' => $customerData['mobile_number']
                    ]);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
