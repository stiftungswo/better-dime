<?php

namespace App\Providers;

use App\Models\Employee\Employee;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Exception;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        $this->app['auth']->viaRequest('jwt-auth', function ($request) {
            /** @var \Laravel\Lumen\Http\Request $request */

            if ($request->header('Authorization')) {
                $split = explode(' ', $request->header('Authorization'), 2);
                if (sizeof($split) > 1) {
                    $token = $split[1];
                } else {
                    return null;
                }
            } elseif ($request->query('auth')) {
                $token = $request->query('auth');
            } else {
                // Unauthorized response if token not there
                return null;
            }

            try {
                $credentials = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
                $employee = Employee::findOrFail($credentials->sub);
            } catch (Exception $e) {
                return null;
            }

            // handle case if somebody's access to Dime got blocked recently and its token is still valid
            if ($employee->can_login) {
                if (app()->bound('sentry')) {
                    /** @var \Raven_Client $sentry */
                    $sentry = app('sentry');
                    $sentry->user_context([
                        'id' => $employee->id,
                        'email' => $employee->email
                    ]);
                }
                return $employee->id;
            } else {
                return null;
            }
        });
    }
}
