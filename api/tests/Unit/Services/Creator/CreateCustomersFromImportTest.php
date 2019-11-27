<?php

namespace Tests\Unit\Services\Creator;

use App\Models\Customer\Company;
use App\Models\Customer\CustomerTag;
use App\Models\Customer\Person;
use App\Models\Customer\Phone;
use App\Services\Creator\CreateCustomersFromImport;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CreateCustomersFromImportTest extends \TestCase
{
    use DatabaseTransactions;

    public function testCreate()
    {
        // with the following things, it should create a company and a person with a phone number for each
        $template = $this->importTemplate();
        CreateCustomersFromImport::create($template['rate_group_id'], $template['hidden'], $template['customers_to_import'], $template['customer_tags']);

        // first, check the company
        $company = Company::with(   'addresses', 'phone_numbers')->where('name', '=', $template['customers_to_import'][0]['name'])->first();
        $this->assertEquals($template['customers_to_import'][0]['city'], $company->addresses->first()->city);
        $this->assertEquals($template['customers_to_import'][0]['comment'], $company->comment);
        $this->assertEquals($template['customers_to_import'][0]['country'], $company->addresses->first()->country);
        $this->assertEquals($template['customers_to_import'][0]['email'], $company->email);
        $this->assertEquals($template['customers_to_import'][0]['postcode'], $company->addresses->first()->postcode);
        $this->assertEquals($template['customers_to_import'][0]['street'], $company->addresses->first()->street);
        $this->assertEquals($template['customer_tags'], $company->tags);
        $this->assertEquals($template['hidden'], $company->hidden);
        $this->assertEquals($template['rate_group_id'], $company->rate_group_id);

        // check the main number of SWO
        $swoMainNumber = Phone::where('number', '=', '044 888 33 22')->first();
        $this->assertEquals($company->id, $swoMainNumber->customer_id);
        $this->assertEquals(1, $swoMainNumber->category);

        // check the fax number of SWO
        $swoFaxNumber = Phone::where('number', '=', '044 888 33 23')->first();
        $this->assertEquals($company->id, $swoFaxNumber->customer_id);
        $this->assertEquals(5, $swoFaxNumber->category);

        // second, check the employee
        $person = Person::with('addresses')->where('email', '=', 'hh@stiftungswo.ch')->first();
        $this->assertEquals($template['customers_to_import'][1]['city'], $person->addresses->first()->city);
        $this->assertEquals($template['customers_to_import'][1]['comment'], $person->comment);
        $this->assertEquals($template['customers_to_import'][1]['country'], $person->addresses->first()->country);
        $this->assertEquals($template['customers_to_import'][1]['department'], $person->department);
        $this->assertEquals($template['customers_to_import'][1]['first_name'], $person->first_name);
        $this->assertEquals($template['customers_to_import'][1]['last_name'], $person->last_name);
        $this->assertEquals($company->id, $person->company_id);
        $this->assertEquals($template['customers_to_import'][1]['postcode'], $person->addresses->first()->postcode);
        $this->assertEquals($template['customers_to_import'][1]['street'], $person->addresses->first()->street);
        $this->assertEquals($template['customer_tags'], $person->tags);
        $this->assertEquals($template['hidden'], $person->hidden);
        $this->assertEquals($template['rate_group_id'], $person->rate_group_id);

        // now get the two phone numbers of the employee
        $hansMobileNumber = Phone::where('number', '=', '079 666 77 22')->first();
        $this->assertEquals($person->id, $hansMobileNumber->customer_id);
        $this->assertEquals(4, $hansMobileNumber->category);

        // now get the private number of hans
        $hansPrivateNumber = Phone::where('number', '=', '099 888 22 33')->first();
        $this->assertEquals($person->id, $hansPrivateNumber->customer->id);
        $this->assertEquals(3, $hansPrivateNumber->category);
    }

    private function importTemplate()
    {
        $rateGroupdId = factory(\App\Models\Service\RateGroup::class)->create()->id;
        $tagId = factory(CustomerTag::class)->create()->id;

        return [
            'customer_tags' => [$tagId],
            'customers_to_import' => [[
                'type' => 'company',
                'city' => 'Schwerzenbach',
                'comment' => 'Dies ist ein Kommentar über die SWO.',
                'country' => 'Schweiz',
                'department' => null,
                'email' => 'swo@stiftungswo.ch',
                'fax' => '044 888 33 23',
                'first_name' => null,
                'main_number' => '044 888 33 22',
                'name' => 'TEST_Stiftung Wirtschaft und Ökologie',
                'last_name' => null,
                'postcode' => 8603,
                'street' => 'Bahnstrasse 18b',
                'supplement' => null
            ], [
                'type' => 'person',
                'city' => 'Opfikon',
                'comment' => 'Dies ist der heimliche Chef der SWO, aber wir sagen es nicht so öffentlich',
                'country' => 'Schweiz',
                'department' => 'Integration',
                'email' => 'hh@stiftungswo.ch',
                'fax' => null,
                'first_name' => 'Hans',
                'main_number' => '099 888 22 33',
                'mobile_number' => '079 666 77 22',
                'name' => 'TEST_Stiftung Wirtschaft und Ökologie',
                'last_name' => 'Heinrich',
                'postcode' => 8092,
                'street' => 'Bahnhofstrasse 534c',
                'supplement' => null
            ],
            ],
            'hidden' => false,
            'rate_group_id' => $rateGroupdId
        ];
    }
}
