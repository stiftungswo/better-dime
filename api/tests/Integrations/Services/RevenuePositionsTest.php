<?php

namespace Tests\Integrations\Services;

use Carbon\Carbon;
use Laravel\Lumen\Testing\DatabaseTransactions;

class RevenuePositionsTest extends \TestCase
{
    use DatabaseTransactions;

    public function testGetExcel()
    {
        $from = Carbon::now()->startOfYear()->format('Y-m-d');
        $to = Carbon::now()->endOfYear()->format('Y-m-d');

        $this->asUser()->json('GET', "api/v1/reports/revenue?from=$from&to=$to")->assertResponseStatus(200);
    }
}
