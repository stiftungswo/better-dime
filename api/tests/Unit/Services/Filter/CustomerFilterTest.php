<?php

namespace App\Services\Filter;

use App\Models\Customer\Company;
use App\Models\Customer\CustomerTag;
use App\Models\Customer\Person;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CustomerFilterTest extends \TestCase
{
    use DatabaseTransactions;

    public function testFetchWithTags()
    {
        $tag = factory(CustomerTag::class)->create();
        $customer = factory(Person::class)->create();
        $customerWithoutTag = factory(Company::class)->create();
        $customer->customer_tags()->sync($tag);

        $result = CustomerFilter::fetch(['customer_tags' => $tag->id]);
        $this->assertTrue($result->contains($customer));
        $this->assertFalse($result->contains($customerWithoutTag));
    }

    public function testFetchWithHiddenExcluded()
    {
        $hiddenCustomer = factory(Person::class)->create([
            'hidden' => true
        ]);
        $visibleCustomer = factory(Person::class)->create([
            'hidden' => false
        ]);

        $result = CustomerFilter::fetch(['include_hidden' => 0]);
        $this->assertTrue($result->contains($visibleCustomer));
        $this->assertFalse($result->contains($hiddenCustomer));

        $result = CustomerFilter::fetch(['include_hidden' => 1]);
        $this->assertTrue($result->contains($visibleCustomer));
        $this->assertTrue($result->contains($hiddenCustomer));
    }
}
