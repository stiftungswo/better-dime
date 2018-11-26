<?php

namespace Tests\Integrations\Controllers;

use App\Models\Customer\Address;
use Laravel\Lumen\Testing\DatabaseTransactions;

class AddressControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testIndex()
    {
        factory(Address::class)->create();
        $this->asAdmin()->json('GET', 'api/v1/addresses');
        $this->assertCount(count(Address::all()), $this->responseToArray());
    }
}
