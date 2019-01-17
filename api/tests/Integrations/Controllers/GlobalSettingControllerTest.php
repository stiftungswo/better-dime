<?php

namespace Tests\Integrations\Controllers;

use App\Models\Project\Project;
use App\Models\Project\ProjectEffort;
use App\Models\Project\ProjectPosition;
use App\Models\Service\Service;
use Laravel\Lumen\Testing\DatabaseTransactions;

class GlobalSettingControllerTest extends \TestCase
{
    use DatabaseTransactions;

    public function testGet()
    {
        $this->asUser()->json('GET', 'api/v1/global_settings')->assertResponseStatus(200);
    }

    public function testPutAsUser()
    {
        $this->asUser()->json('PUT', 'api/v1/global_settings')->assertResponseStatus(401);
    }

    public function testPutInvalid()
    {
        $template = $this->settingsTemplate();
        $template['sender_name'] = null;
        $this->asAdmin()->json('PUT', 'api/v1/global_settings', $template)->assertResponseStatus(422);
    }

    public function testPutValid()
    {
        $template = $this->settingsTemplate();
        $this->asAdmin()->json('PUT', 'api/v1/global_settings', $template)->assertResponseStatus(200);
        $this->assertResponseMatchesTemplate($template);
    }

    private function settingsTemplate()
    {
        return [
            'service_order_comment' => 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
            'sender_name' => 'Example Company',
            'sender_street' => 'Salami Street 1',
            'sender_zip' => '1234',
            'sender_city' => 'Zürich',
            'sender_phone' => '044 333 44 55',
            'sender_mail' => 'dime@example.com',
            'sender_vat' => 'CHE-123.456.543',
            'sender_bank' => '07-007-07',
            'sender_web' => 'https://github.com/stiftungswo/betterDime',
        ];
    }
}
