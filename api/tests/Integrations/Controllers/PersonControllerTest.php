<?php

namespace Tests\Integrations\Controllers;

use App\Models\Customer\Address;
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

    public function testValidDuplicate()
    {
        $personTemplate = factory(Person::class)->create();
        $personTemplate->addresses()->saveMany(factory(Address::class, 5)->make());
        $personTemplate->phone_numbers()->saveMany(factory(Phone::class, 5)->make());
        $this->asAdmin()->json('GET', 'api/v1/people/' . $personTemplate->id);
        $template = $this->responseToArray();

        $this->asAdmin()->json('POST', 'api/v1/people/' . $personTemplate->id . '/duplicate')->assertResponseOk();
        $this->assertResponseMatchesTemplate($template, true);
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

    public function testValidPut()
    {
        // also add one nested relation, delete one and update one
        $person = factory(Person::class)->create();
        $phonesList = factory(Phone::class)->times(2)->make();
        $addressesList = factory(Address::class)->times(2)->make();
        $person->phone_numbers()->saveMany($phonesList);
        $person->addresses()->saveMany($addressesList);

        $template = $this->personTemplate();
        $template['phone_numbers']['0']['id'] = $phonesList[0]->id;
        $template['addresses']['0']['id'] = $addressesList[0]->id;

        $this->asAdmin()->json('PUT', 'api/v1/people/' . $person->id, $template);
        $this->assertResponseMatchesTemplate($template);
    }

    private function personTemplate()
    {
        $idsOfTags = factory(CustomerTag::class)->times(2)->create()->map(function ($t) {
            return $t->id;
        });
        $personId = factory(Company::class)->create()->id;

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
            'company_id' => $personId,
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
