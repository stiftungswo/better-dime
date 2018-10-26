<?php

namespace Tests\Integrations\Controllers;

use App\Models\Customer\Address;
use App\Models\Customer\Company;
use App\Models\Customer\CustomerTag;
use App\Models\Customer\Phone;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CompanyControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testIndex()
    {
        factory(Company::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/companies');
        $decodedResponse = $this->responseToArray();
        $this->assertEquals(count(Company::all()), count($decodedResponse));
    }

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/companies/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $companyId = factory(Company::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/companies/' . $companyId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testInvalidGet()
    {
        // can't get because object does not exist
        $this->asAdmin()->json('GET', 'api/v1/companies/1789764')->assertResponseStatus(404);
    }

    public function testValidGet()
    {
        $company = factory(Company::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/companies/' . $company->id)->assertResponseOk();
        $this->assertEquals($company->name, $this->responseToArray()['name']);
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/companies', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = $this->companyTemplate();
        $this->asAdmin()->json('POST', 'api/v1/companies', $template);
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/companies/1789764', $this->companyTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $companyId = factory(Company::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/companies/' . $companyId, [])->assertResponseStatus(422);
    }

    public function testInvalidNestedPut()
    {
        // can't update because parameters are invalid
        $companyId = factory(Company::class)->create()->id;
        $template = $this->companyTemplate();
        unset($template['phone_numbers']);
        $template['phone_numbers'] = ['werqwer'];

        $this->asAdmin()->json('PUT', 'api/v1/companies/' . $companyId, $template)->assertResponseStatus(500);
    }

    public function testValidPut()
    {
        // also add one nested relation, delete one and update one
        $company = factory(Company::class)->create();
        $phonesList = factory(Phone::class)->times(2)->make();
        $addressesList = factory(Address::class)->times(2)->make();
        $company->phone_numbers()->saveMany($phonesList);
        $company->addresses()->saveMany($addressesList);

        $template = $this->companyTemplate();
        $template['phone_numbers']['0']['id'] = $phonesList[0]->id;
        $template['addresses']['0']['id'] = $addressesList[0]->id;
        
        $this->asAdmin()->json('PUT', 'api/v1/companies/' . $company->id, $template);
        $this->assertResponseMatchesTemplate($template);
    }

    private function companyTemplate()
    {
        $idsOfTags = factory(CustomerTag::class)->times(2)->create()->map(function ($t) {
            return $t->id;
        });

        return [
            'addresses' => [
                [
                    'description' => 'Hauptstandort',
                    'street' => 'Im Schatzacker 5',
                    'supplement' => 'Kein Postfach',
                    'postcode' => 8600,
                    'city' => 'Dübendorf-Gfenn',
                    'country' => 'Schweiz'
                ],
                [
                    'description' => 'Alter Standort',
                    'street' => 'Bahnstrasse 18b',
                    'supplement' => 'Kein Postfach',
                    'postcode' => 8603,
                    'city' => 'Schwerzenbach',
                    'country' => 'Schweiz'
                ]
            ],
            'comment' => 'Dies ist ein Kunde der SWO.',
            'chargeable' => false,
            'email' => 'kunde@der.swo',
            'hidden' => false,
            'name' => 'SWO Kunde',
            'phone_numbers' => [
                [
                    'category' => 1,
                    'number' => '043 355 58 44'
                ], [
                    'category' => 4,
                    'number' => '078 777 44 22'
                ]
            ],
            'rate_group_id' => factory(\App\Models\Service\RateGroup::class)->create()->id,
            'tags' => $idsOfTags->toArray()
        ];
    }
}
