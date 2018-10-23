<?php

namespace Tests\Integrations;

use App\Models\Customer\Company;
use App\Models\Customer\CustomerTag;
use App\Models\Customer\Person;
use App\Models\Customer\Phone;
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
        $template = $this->personTemplate();
        $this->asAdmin()->json('POST', 'api/v1/people', $template);
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/people/1789764', $this->personTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $personId = factory(Person::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/people/' . $personId, [])->assertResponseStatus(422);
    }

    public function testInvalidNestedPut()
    {
        // can't update because parameters are invalid
        $personId = factory(Person::class)->create()->id;
        $template = $this->personTemplate();
        unset($template['phone_numbers']);
        $template['phone_numbers'] = ['werqwer'];

        $this->asAdmin()->json('PUT', 'api/v1/people/' . $personId, $template)->assertResponseStatus(500);
    }

    public function testValidPut()
    {
        $person = factory(Person::class)->create();
        $phone = factory(Phone::class)->make();
        $person->phone_numbers()->save($phone);

        $template = $this->personTemplate();
        $template['phone_numbers']['0']['id'] = $phone->id;

        $this->asAdmin()->json('PUT', 'api/v1/people/' . $person->id, $template);
        file_put_contents('hello.html', $this->response->getContent());
        $this->assertResponseMatchesTemplate($template);
    }

    private function personTemplate()
    {
        $idsOfTags = factory(CustomerTag::class)->times(2)->create()->map(function ($t) {
            return $t->id;
        });
        $personId = factory(Company::class)->create()->id;

        return [
            'comment' => 'Dies ist ein Kunde der SWO.',
            'company_id' => $personId,
            'chargeable' => false,
            'department' => 'Landwirtschaft und Natur',
            'email' => 'kunde@der.swo',
            'first_name' => 'Max',
            'hidden' => false,
            'last_name' => 'Mustermann',
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
            'salutation' => 'Prof. Dr.',
            'tags' => $idsOfTags->toArray()

        ];
    }
}
