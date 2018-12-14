<?php

namespace Tests\Integrations\Controllers;

use App\Models\Costgroup\Costgroup;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CostgroupControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testIndex()
    {
        $number = factory(Costgroup::class)->create()->number;
        $this->asAdmin()->json('GET', 'api/v1/costgroups')->assertResponseOk();
        $decodedResponse = $this->responseToArray();
        $ok = false;
        foreach ($decodedResponse as $item) {
            if ($item['number'] == $number) {
                $ok = true;
                break;
            }
        }
        $this->assertTrue($ok);
    }
}
