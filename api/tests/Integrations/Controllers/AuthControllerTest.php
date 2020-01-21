<?php

namespace Tests\Integrations\Controllers;

use App\Models\Employee\Employee;
use Laravel\Lumen\Testing\DatabaseTransactions;

class AuthControllerTest extends \TestCase
{

    use DatabaseTransactions;

    public function testInvalidEmailLogin()
    {
        // should raise if user with the email wasn't found
        $this->json('POST', 'api/v1/employees/login', [
            'email' => 'invalid@notsovalid.com',
            'encrypted_password' => 'goodpassword!!'
        ])->assertResponseStatus(400);
    }

    public function testInvalidPasswordLogin()
    {
        $user = factory(Employee::class)->create();

        $this->json('POST', 'api/v1/employees/login', [
            'email' => $user->email,
            'encrypted_password' => 'thisissecorrectpassword'
        ])->assertResponseStatus(400);
    }

    public function testBlockedLogin()
    {
        $employee = factory(Employee::class)->create([
            'can_login' => false,
            'encrypted_password' => 'VeryGudPassword'
        ]);

        $this->json('POST', 'api/v1/employees/login', [
            'email' =>  $employee->email,
            'encrypted_password' => 'VeryGudPassword'
        ])->assertResponseStatus(400);
    }

    public function testValidUserLogin()
    {
        // should work
        $user = factory(Employee::class)->create([
            'can_login' => true,
            'encrypted_password' => 'VeryGudPassword'
        ]);
        $this->json('POST', 'api/v1/employees/login', [
            'email' =>  $user->email,
            'encrypted_password' => 'VeryGudPassword'
        ]);
        $this->assertResponseOk();
    }
}
