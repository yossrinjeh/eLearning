<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormationResource;
use App\Models\Formation;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function index()
    {
        $formations = Formation::with(['trainer', 'room'])
            ->orderBy('start_date')
            ->paginate(10);
            
        return FormationResource::collection($formations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'duration' => 'required|integer',
            'max_capacity' => 'required|integer|min:1',
            'room_id' => 'required|exists:rooms,id',
            'trainer_id' => 'required|exists:users,id'
        ]);

        $formation = Formation::create($validated);

        return new FormationResource($formation);
    }

    public function show(Formation $formation)
    {
        return new FormationResource(
            $formation->load(['trainer', 'room', 'enrollments', 'evaluations'])
        );
    }

    public function update(Request $request, Formation $formation)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'duration' => 'sometimes|integer',
            'max_capacity' => 'sometimes|integer|min:1',
            'room_id' => 'sometimes|exists:rooms,id',
            'trainer_id' => 'sometimes|exists:users,id',
            'status' => 'sometimes|in:upcoming,ongoing,completed,cancelled'
        ]);

        $formation->update($validated);

        return new FormationResource($formation);
    }

    public function destroy(Formation $formation)
    {
        $formation->delete();
        return response()->json(null, 204);
    }
} 