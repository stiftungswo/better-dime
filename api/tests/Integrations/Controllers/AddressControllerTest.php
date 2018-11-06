<?php

namespace Tests\Integrations\Controllers;

use App\Models\Customer\Address;

class AddressControllerTest extends \TestCase
{
    public function testIndex()
    {
        factory(Address::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/addresses');
        $this->assertCount(count(Address::all()), $this->responseToArray());
    }
}
