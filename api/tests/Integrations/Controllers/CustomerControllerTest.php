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
        $address = factory(Address::class)->create(['customer_id' => $company->id]);
        $this->asAdmin()->json('GET', 'api/v1/customers/' . $company->id)->assertResponseOk();

        $this->assertCount(1, $this->responseToArray()['addresses']);
    }

    public function testPersonIncludesCompanyAddresses()
    {
        $company = factory(Company::class)->create();
        $companyAddress = factory(Address::class)->create(['customer_id' => $company->id]);

        $person = factory(Person::class)->create(['company_id' => $company->id]);
        $personAddress = factory(Address::class)->create(['customer_id' => $person->id]);

        $this->asAdmin()->json('GET', 'api/v1/customers/' . $person->id)->assertResponseOk();
        $this->assertCount(2, $this->responseToArray()['addresses']);
    }
}
