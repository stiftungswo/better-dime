<?php

namespace Middlewares;

class AdminMiddlewareTest extends \TestCase
{
    public function testErrorOnRouteWithAdminRights()
    {
        $this->asUser()->json('GET', '/admin')->assertResponseStatus(401);
        $this->assertEquals('You are not allowed to access this content', $this->response->getContent());
    }

    public function testSuccessfulAccess()
    {
        $this->asAdmin()->json('GET', '/admin')->assertResponseOk();
        $this->assertEquals('Admin check successfully', $this->response->getContent());
    }
}
