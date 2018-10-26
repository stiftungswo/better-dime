<?php

namespace Tests\Integrations\Middlewares;

use App\Models\Employee\Employee;
use Firebase\JWT\JWT;

class AuthenticateTest extends \TestCase
{
    public function testErrorOnRequestWithNoToken()
    {
        // should deny us with 401 error because no token was delivered
        $this->json('GET', 'api/v1/offers')->assertResponseStatus(401);
    }

    public function testErrorOnRequestWithInvalidToken()
    {
        // send an invalid formatted string as "token"
        $this->json('GET', 'api/v1/offers', [], [
            'Authorization' => 'jabadabadu'
        ])->assertResponseStatus(401);
    }

    public function testErrorTokenExpired()
    {
        $payload = [
            'iss' => "dime-api",
            'sub' => 1,
            'is_admin' => false,
            'iat' => time() - 60 * 60 * 60,
            'exp' => time() - 60 * 60 * 60
        ];

        $this->json('GET', 'api/v1/offers', [], [
            'Authorization' => 'Bearer ' . JWT::encode($payload, env('JWT_SECRET'))
        ])->assertResponseStatus(401);
    }

    public function testErrorInvalidEmployeeId()
    {
        $payload = [
            'iss' => "dime-api",
            'sub' => 324232,
            'is_admin' => false,
            'iat' => time(),
            'exp' => time() + 60*60*24
        ];

        $this->json('GET', 'api/v1/offers', [], [
            'Authorization' => 'Bearer ' . JWT::encode($payload, env('JWT_SECRET'))
        ])->assertResponseStatus(401);
    }

    public function testErrorEmployeeAccessBlocked()
    {
        $employeeId = factory(Employee::class)->create(['can_login' => false])->id;

        $payload = [
            'iss' => "dime-api",
            'sub' => $employeeId,
            'is_admin' => false,
            'iat' => time(),
            'exp' => time() + 60*60*24
        ];

        $this->json('GET', 'api/v1/offers', [], [
            'Authorization' => 'Bearer ' . JWT::encode($payload, env('JWT_SECRET'))
        ])->assertResponseStatus(401);
    }

    public function testValidLogin()
    {
        $employeeId = factory(Employee::class)->create(['can_login' => true])->id;

        $payload = [
            'iss' => "dime-api",
            'sub' => $employeeId,
            'is_admin' => false,
            'iat' => time(),
            'exp' => time() + 60*60*24
        ];

        $this->json('GET', 'api/v1/offers', [], [
            'Authorization' => 'Bearer ' . JWT::encode($payload, env('JWT_SECRET'))
        ])->assertResponseOk();
    }
}
