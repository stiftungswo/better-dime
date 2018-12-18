<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle($request, Closure $next)
    {
        if (Auth::user()->is_admin) {
            return $next($request);
        }

        return response('You are not allowed to access this content', 401);
    }
}
