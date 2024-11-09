<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::with('formations')->paginate(10);
        return RoomResource::collection($rooms);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'equipment' => 'nullable|string',
            'status' => 'required|in:available,occupied'
        ]);

        $room = Room::create($validated);
        return new RoomResource($room);
    }

    public function show(Room $room)
    {
        return new RoomResource($room->load('formations'));
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'equipment' => 'nullable|string',
            'status' => 'sometimes|in:available,occupied'
        ]);

        $room->update($validated);
        return new RoomResource($room);
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return response()->json(null, 204);
    }
} 