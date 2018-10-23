<?php

namespace Tests\Integrations;

use App\Models\Customer\Company;
use App\Models\Customer\CustomerTag;
use App\Models\Customer\Person;
use Laravel\Lumen\Testing\DatabaseTransactions;

class PersonControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testIndex()
    {
        factory(Person::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/people');
        $decodedResponse = $this->responseToArray();
        $this->assertEquals(count(Person::all()), count($decodedResponse));
    }

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/people/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $personId = factory(Person::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/people/' . $personId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testInvalidGet()
    {
        // can't get because object does not exist
        $this->asAdmin()->json('GET', 'api/v1/people/1789764')->assertResponseStatus(404);
    }

    public function testValidGet()
    {
        $person = factory(Person::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/people/' . $person->id)->assertResponseOk();
        $this->assertEquals($person->first_name, $this->responseToArray()['first_name']);
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/people', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $idsOfTags = factory(CustomerTag::class)->times(2)->create()->map(function ($t) {
            return $t->id;
        });
        $companyId = factory(Company::class)->create()->id;

        $template = [
            'comment' => 'Dies ist ein Kunde der SWO.',
            'company_id' => $companyId,
            'chargeable' => false,
            'department' => 'Landwirtschaft und Natur',
            'email' => 'kunde@der.swo',
            'first_name' => 'Max',
            'hidden' => false,
            'last_name' => 'Mustermann',
            'rate_group_id' => factory(\App\Models\Service\RateGroup::class)->create()->id,
            'salutation' => 'Prof. Dr.',
            'tags' => $idsOfTags->toArray()

        ];
        $this->asAdmin()->json('POST', 'api/v1/people', $template);
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        $idsOfTags = factory(CustomerTag::class)->times(2)->create()->map(function ($t) {
            return $t->id;
        });
        $companyId = factory(Company::class)->create()->id;

        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/people/1789764', [
            'comment' => 'Dies ist ein Kunde der SWO.',
            'company_id' => $companyId,
            'chargeable' => false,
            'department' => 'Landwirtschaft und Natur',
            'email' => 'kunde@der.swo',
            'first_name' => 'Max',
            'hidden' => false,
            'last_name' => 'Mustermann',
            'rate_group_id' => factory(\App\Models\Service\RateGroup::class)->create()->id,
            'salutation' => 'Prof. Dr.',
            'tags' => $idsOfTags->toArray()

        ])->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $personId = factory(Person::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/people/' . $personId, [])->assertResponseStatus(422);
    }

    public function testValidPut()
    {
        $personId = factory(Person::class)->create()->id;
        $idsOfTags = factory(CustomerTag::class)->times(2)->create()->map(function ($t) {
            return $t->id;
        });
        $companyId = factory(Company::class)->create()->id;

        $template = [
            'comment' => 'Dies ist ein Kunde der SWO.',
            'company_id' => $companyId,
            'chargeable' => false,
            'department' => 'Landwirtschaft und Natur',
            'email' => 'kunde@der.swo',
            'first_name' => 'Max',
            'hidden' => false,
            'last_name' => 'Mustermann',
            'rate_group_id' => factory(\App\Models\Service\RateGroup::class)->create()->id,
            'salutation' => 'Prof. Dr.',
            'tags' => $idsOfTags->toArray()

        ];

        $this->asAdmin()->json('PUT', 'api/v1/people/' . $personId, $template);
        $this->assertResponseMatchesTemplate($template);
    }
}
