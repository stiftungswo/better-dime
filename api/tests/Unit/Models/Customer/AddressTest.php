<?php

namespace Tests\Unit\Models\Customer;

use App\Models\Customer\Address;
use Laravel\Lumen\Testing\DatabaseTransactions;

class AddressTest extends \TestCase
{
    use DatabaseTransactions;

    public function testToString()
    {
        $address = factory(Address::class)->create([
            'supplement' => null
        ]);

        $this->assertEquals("{$address->street}, {$address->zip} {$address->city}, {$address->country}", (string)$address);
    }
}
