<?php

namespace Tests\Integrations\Controllers;

use App\Models\Customer\Address;
use App\Models\Customer\Company;
use App\Models\Customer\Customer;
use App\Models\Customer\Person;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CustomerControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testExportWithInvalidParameters()
    {
        $this->asAdmin()->json('GET', 'api/v1/customers/export')->assertResponseStatus(422);
    }

    public function testExportText()
    {
        $this->asAdmin()->json('GET', 'api/v1/customers/export?export_format=1&include_hidden=0')->assertResponseOk();
    }

    public function testExportExcel()
    {
        $this->asAdmin()->json('GET', 'api/v1/customers/export?export_format=2&include_hidden=0')->assertResponseOk();
        $this->assertEquals('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', $this->response->headers->get('Content-Type'));
    }

    public function testImportTemplateGet()
    {
        $this->asAdmin()->json('GET', 'api/v1/customers/import/template')->assertResponseOk();
        $this->assertEquals('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', $this->response->headers->get('Content-Type'));
    }

    public function testImportInvalidParams()
    {
        $this->asAdmin()->json('POST', 'api/v1/customers/import', [])->assertResponseStatus(422);
    }

    public function testValidImportParams()
    {
        $this->asAdmin()->json('POST', 'api/v1/customers/import', $this->importTemplate())->assertResponseOk();
    }

    public function testVerifyImportInvalidParams()
    {
        $this->asAdmin()->json('POST', 'api/v1/customers/import/verify', [])->assertResponseStatus(400);
    }

    public function testIndex()
    {
        $this->asAdmin()->json('GET', 'api/v1/customers');
        $this->assertCount(count(Customer::all()), $this->responseToArray());
    }

    public function testValidGetPerson()
    {
        $person = factory(Person::class)->create();
        $address = factory(Address::class)->create(['customer_id' => $person->id]);
        $this->asAdmin()->json('GET', 'api/v1/customers/' . $person->id)->assertResponseOk();

        $this->assertCount(1, $this->responseToArray()['addresses']);
    }

    public function testValidGetCompany()
    {
        $company = factory(Company::class)->create();
        factory(Address::class)->create(['customer_id' => $company->id]);
        $this->asAdmin()->json('GET', 'api/v1/customers/' . $company->id)->assertResponseOk();

        $this->assertCount(1, $this->responseToArray()['addresses']);
    }

    public function testPersonIncludesCompanyAddresses()
    {
        $company = factory(Company::class)->create();
        factory(Address::class)->create(['customer_id' => $company->id]);

        $person = factory(Person::class)->create(['company_id' => $company->id]);
        factory(Address::class)->create(['customer_id' => $person->id]);

        $this->asAdmin()->json('GET', 'api/v1/customers/' . $person->id)->assertResponseOk();
        $this->assertCount(2, $this->responseToArray()['addresses']);
    }

    private function importTemplate()
    {
        $rateGroupdId = factory(\App\Models\Service\RateGroup::class)->create()->id;
        $tagId = factory(\App\Models\Customer\CustomerTag::class)->create()->id;

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
                'name' => 'Stiftung Wirtschaft und Ökologie',
                'last_name' => null,
                'zip' => 8603,
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
                'name' => 'Stiftung Wirtschaft und Ökologie',
                'last_name' => 'Heinrich',
                'zip' => 8092,
                'street' => 'Bahnhofstrasse 534c',
                'supplement' => null
            ],
            ],
            'hidden' => false,
            'rate_group_id' => $rateGroupdId
        ];
    }
}
