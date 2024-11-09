<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentEvaluationResource;
use App\Models\StudentEvaluation;
use Illuminate\Http\Request;

class StudentEvaluationController extends Controller
{
    public function index()
    {
        $studentEvaluations = StudentEvaluation::with(['evaluation', 'user'])
            ->paginate(10);
        return StudentEvaluationResource::collection($studentEvaluations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'evaluation_id' => 'required|exists:evaluations,id',
            'user_id' => 'required|exists:users,id',
            'score' => 'required|numeric|min:0|max:100',
            'comments' => 'nullable|string'
        ]);

        $studentEvaluation = StudentEvaluation::create($validated);
        return new StudentEvaluationResource($studentEvaluation);
    }

    public function show(StudentEvaluation $studentEvaluation)
    {
        return new StudentEvaluationResource(
            $studentEvaluation->load(['evaluation', 'user'])
        );
    }

    public function update(Request $request, StudentEvaluation $studentEvaluation)
    {
        $validated = $request->validate([
            'score' => 'sometimes|numeric|min:0|max:100',
            'comments' => 'nullable|string'
        ]);

        $studentEvaluation->update($validated);
        return new StudentEvaluationResource($studentEvaluation);
    }

    public function destroy(StudentEvaluation $studentEvaluation)
    {
        $studentEvaluation->delete();
        return response()->json(null, 204);
    }
} 