<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\TrainerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:student,trainer',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            // Trainer profile fields
            'specialities' => $request->role === 'trainer' ? 'required|string' : 'nullable',
            'experience' => $request->role === 'trainer' ? 'required|string' : 'nullable',
            'cv_file' => $request->role === 'trainer' ? 'required|file|mimes:pdf,doc,docx|max:2048' : 'nullable'
        ]);

        try {
            DB::beginTransaction();

            // Create user
            $user = User::create([
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'phone' => $request->phone,
                'address' => $request->address,
                'is_active' => $request->role === 'student'
            ]);

            // Handle trainer profile and CV upload
            if ($request->role === 'trainer') {
                // Store CV file
                $cvPath = null;
                if ($request->hasFile('cv_file')) {
                    $file = $request->file('cv_file');
                    $fileName = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
                    $cvPath = $file->storeAs('cvs', $fileName, 'public');
                }

                TrainerProfile::create([
                    'user_id' => $user->id,
                    'specialities' => $request->specialities,
                    'experience' => $request->experience,
                    'cv_path' => $cvPath,
                    'is_active' => false
                ]);
            }

            DB::commit();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => $request->role === 'trainer' 
                    ? 'Registration successful. Please wait for admin approval.' 
                    : 'User registered successfully',
                'user' => new UserResource($user->load('trainerProfile')),
                'token' => $token
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            // Delete uploaded file if exists
            if (isset($cvPath) && Storage::disk('public')->exists($cvPath)) {
                Storage::disk('public')->delete($cvPath);
            }
            throw $e;
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => new UserResource($user),
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return new UserResource($request->user());
    }
} 