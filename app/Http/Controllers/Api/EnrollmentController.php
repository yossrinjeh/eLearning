<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use App\Models\Formation;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index()
    {
        $enrollments = Enrollment::with(['user', 'formation'])->paginate(10);
        return EnrollmentResource::collection($enrollments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'formation_id' => 'required|exists:formations,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:pending,accepted,rejected,completed',
            'enrollment_date' => 'required|date'
        ]);

        $formation = Formation::findOrFail($validated['formation_id']);
        $currentEnrollments = $formation->enrollments()->count();

        if ($currentEnrollments >= $formation->max_capacity) {
            return response()->json([
                'message' => 'Formation has reached maximum capacity'
            ], 422);
        }

        $enrollment = Enrollment::create($validated);
        return new EnrollmentResource($enrollment);
    }

    public function show(Enrollment $enrollment)
    {
        return new EnrollmentResource($enrollment->load(['user', 'formation']));
    }

    public function update(Request $request, Enrollment $enrollment)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,accepted,rejected,completed'
        ]);

        $enrollment->update($validated);
        return new EnrollmentResource($enrollment);
    }

    public function destroy(Enrollment $enrollment)
    {
        $enrollment->delete();
        return response()->json(null, 204);
    }
} 