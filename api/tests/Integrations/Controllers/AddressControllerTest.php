<?php

namespace Tests\Integrations\Controllers;

use App\Models\Customer\Customer;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CustomerControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testIndex()
    {
        $this->asAdmin()->json('GET', 'api/v1/customers');
        $this->assertCount(count(Customer::all()), $this->responseToArray());
    }
}
