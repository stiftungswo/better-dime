<?php

namespace Tests\Integrations\Controllers;

use App\Models\Customer\CustomerTag;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CustomerTagControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testArchive()
    {
        $project = factory(CustomerTag::class)->create([
            'archived' => false
        ]);
        $this->assertFalse($project->archived);
        $this->asAdmin()->json('PUT', 'api/v1/customer_tags/' . $project->id . '/archive', [
            'archived' => true
        ])->assertResponseOk();
        $this->assertTrue($project->refresh()->archived);
    }

    public function testArchiveRestore()
    {
        $project = factory(CustomerTag::class)->create([
            'archived' => true
        ]);
        $this->assertTrue($project->archived);
        $this->asAdmin()->json('PUT', 'api/v1/customer_tags/' . $project->id . '/archive', [
            'archived' => false
        ])->assertResponseOk();
        $this->assertFalse($project->refresh()->archived);
    }

    public function testIndex()
    {
        factory(CustomerTag::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/customer_tags')->assertResponseOk();
        $this->assertEquals(count(CustomerTag::all()), count($this->responseToArray()));
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/customer_tags', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $this->asAdmin()->json('POST', 'api/v1/customer_tags', $this->customerTagTemplate())->assertResponseOk();
        $this->assertResponseMatchesTemplate($this->customerTagTemplate());
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/customer_tags/1789764', $this->customerTagTemplate())->assertResponseStatus(404);
    }

    public function testInvalidParamsPut()
    {
        // can't update because parameters are invalid
        $customerTagId = factory(CustomerTag::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/customer_tags/' . $customerTagId, [])->assertResponseStatus(422);
    }

    public function testValidPut()
    {
        $customerTagId = factory(CustomerTag::class)->create()->id;
        $this->asAdmin()->json('PUT', 'api/v1/customer_tags/' . $customerTagId, $this->customerTagTemplate())->assertResponseOk();
        $this->assertResponseMatchesTemplate($this->customerTagTemplate());
    }

    private function customerTagTemplate()
    {
        return [
            'archived' => false,
            'name' => 'Zivildienstleistender'
        ];
    }
}
