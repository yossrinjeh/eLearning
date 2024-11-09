<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\TrainerProfileResource;
use App\Models\User;
use App\Models\TrainerProfile;
use Illuminate\Http\Request;

class TrainerController extends Controller
{
    public function index()
    {
        $trainers = User::where('role', 'trainer')
            ->with(['trainerProfile', 'formations'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return UserResource::collection($trainers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'specialities' => 'required|string',
            'experience' => 'required|string',
            'cv_path' => 'nullable|string',
            'user_id' => 'required|exists:users,id'
        ]);

        $user = User::findOrFail($validated['user_id']);
        if ($user->role !== 'trainer') {
            return response()->json(['message' => 'User must be a trainer'], 422);
        }

        $trainerProfile = TrainerProfile::create($validated);
        return new TrainerProfileResource($trainerProfile->load('user'));
    }

    public function show($id)
    {
        $trainer = User::where('role', 'trainer')
            ->with(['trainerProfile', 'formations'])
            ->findOrFail($id);
        return new UserResource($trainer);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'specialities' => 'sometimes|string',
            'experience' => 'sometimes|string',
            'cv_path' => 'nullable|string',
            'is_active' => 'sometimes|boolean'
        ]);

        \DB::beginTransaction();
        try {
            if (isset($validated['is_active'])) {
                $user = User::findOrFail($id);
                $user->update(['is_active' => $validated['is_active']]);
            }

            $trainer = TrainerProfile::where('user_id', $id)->firstOrFail();
            $trainer->update($validated);

            \DB::commit();

            $user = User::with('trainerProfile')->findOrFail($id);
            return new UserResource($user);

        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }
    }

    public function destroy($id)
    {
        $trainer = TrainerProfile::where('user_id', $id)->firstOrFail();
        $trainer->delete();
        return response()->json(null, 204);
    }
} 