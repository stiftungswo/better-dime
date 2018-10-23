<?php

namespace Tests\Integrations;

use App\Models\Customer\Company;
use App\Models\Customer\CustomerTag;
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
        $companyId = factory(Company::class)->create()->id;
        $template = $this->companyTemplate();
        $this->asAdmin()->json('PUT', 'api/v1/companies/' . $companyId, $template);
        $this->assertResponseMatchesTemplate($template);
    }

    private function companyTemplate()
    {
        $idsOfTags = factory(CustomerTag::class)->times(2)->create()->map(function ($t) {
            return $t->id;
        });

        return [
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
