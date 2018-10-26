<?php

namespace Tests\Integrations;

use App\Models\Service\RateGroup;
use Laravel\Lumen\Testing\DatabaseTransactions;

class RateGroupControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testIndex()
    {
        $rateGroupId = factory(RateGroup::class)->create()->id;
        $this->asAdmin()->json('GET', 'api/v1/rate_groups')->assertResponseOk();
        $decodedResponse = $this->responseToArray();
        $this->assertEquals($rateGroupId, end($decodedResponse)['id']);
    }
}
