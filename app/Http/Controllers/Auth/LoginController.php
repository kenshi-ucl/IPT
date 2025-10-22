<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (Auth::attempt($request->only('email', 'password'))) {
                $user = Auth::user();
                
                return response()->json([
                    'user' => $user,
                    'token' => 'session_token',
                    'message' => 'Login successful'
                ]);
            }

            return response()->json([
                'message' => 'The provided credentials are incorrect.'
            ], 401);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Login failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        session()->forget('api_token');
        Auth::logout();
        
        return response()->json([
            'message' => 'Logout successful'
        ]);
    }
}

