<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class SimpleAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Check for Bearer token
        $token = $request->bearerToken();
        
        if ($token && strpos($token, 'logged_in_') === 0) {
            $userId = str_replace('logged_in_', '', $token);
            $user = \App\User::find($userId);
            
            if ($user) {
                Auth::login($user);
                return $next($request);
            }
        }
        
        // Check if user is already authenticated via web session
        if (Auth::check()) {
            return $next($request);
        }
        
        return response()->json(['error' => 'Unauthorized'], 401);
    }
}
