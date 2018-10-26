<?php

namespace Tests\Integrations\Controllers;

use App\Models\Customer\CustomerTag;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CustomerTagControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testIndex()
    {
        factory(CustomerTag::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/customer_tags')->assertResponseOk();
        $decodedResponse = $this->responseToArray();
        $this->assertEquals(count(CustomerTag::all()), count($decodedResponse));
    }

    public function testInvalidDelete()
    {
        // can't delete because object does not exist
        $this->asAdmin()->json('DELETE', 'api/v1/customer_tags/1789764')->assertResponseStatus(404);
    }

    public function testValidDelete()
    {
        $customerTagId = factory(CustomerTag::class)->create()->id;
        $this->asAdmin()->json('DELETE', 'api/v1/customer_tags/' . $customerTagId)->assertResponseOk();
        $this->assertEquals('Entity deleted', $this->response->getContent());
    }

    public function testInvalidPost()
    {
        // send invalid test data
        $this->asAdmin()->json('POST', 'api/v1/customer_tags', [])->assertResponseStatus(422);
    }

    public function testValidPost()
    {
        $template = [
            'name' => 'Zivildienstleistender',
        ];
        $this->asAdmin()->json('POST', 'api/v1/customer_tags', $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }

    public function testInvalidObjectPut()
    {
        // can't update because object does not exist
        $this->asAdmin()->json('PUT', 'api/v1/customer_tags/1789764', [
            'name' => 'Zivildienstleistender',
        ])->assertResponseStatus(404);
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
        $template = [
            'name' => 'Zivildienstleistender',
        ];
        $this->asAdmin()->json('PUT', 'api/v1/customer_tags/' . $customerTagId, $template)->assertResponseOk();
        $this->assertResponseMatchesTemplate($template);
    }
}
