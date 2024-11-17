<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormationResource;
use App\Http\Resources\UserResource;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function getPublicFormations(Request $request)
    {
        $formations = Formation::with(['trainer.trainerProfile', 'room', 'enrollments'])
            ->where('status', 'upcoming')
            ->where('is_active', true)
            ->orderBy('start_date')
            ->get()
            ->map(function ($formation) {
                $seatsLeft = $formation->max_capacity - $formation->enrollments->count();
                return [
                    'id' => $formation->id,
                    'title' => $formation->title,
                    'description' => $formation->description,
                    'start_date' => $formation->start_date,
                    'end_date' => $formation->end_date,
                    'duration' => $formation->duration,
                    'max_capacity' => $formation->max_capacity,
                    'seats_left' => $seatsLeft,
                    'status' => $formation->status,
                    'trainer' => [
                        'id' => $formation->trainer->id,
                        'name' => $formation->trainer->firstname . ' ' . $formation->trainer->lastname,
                        'specialities' => $formation->trainer->trainerProfile?->specialities,
                        'experience' => $formation->trainer->trainerProfile?->experience,
                    ],
                    'room' => [
                        'name' => $formation->room->name,
                        'capacity' => $formation->room->capacity,
                    ]
                ];
            });

        return response()->json($formations);
    }

    public function getActiveTrainers()
    {
        $trainers = User::where('role', 'trainer')
            ->where('is_active', true)
            ->with('trainerProfile')
            ->get()
            ->map(function ($trainer) {
                return [
                    'id' => $trainer->id,
                    'name' => $trainer->firstname . ' ' . $trainer->lastname,
                    'specialities' => $trainer->trainerProfile?->specialities,
                    'experience' => $trainer->trainerProfile?->experience,
                    'formations_count' => $trainer->formations()->count()
                ];
            });

        return response()->json($trainers);
    }

    public function searchFormations(Request $request)
    {
        $query = $request->get('query');
        
        $formations = Formation::with(['trainer.trainerProfile', 'room', 'enrollments'])
            ->where('is_active', true)
            ->where(function($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%")
                  ->orWhereHas('trainer', function($q) use ($query) {
                      $q->where('firstname', 'like', "%{$query}%")
                        ->orWhere('lastname', 'like', "%{$query}%");
                  });
            })
            ->orderBy('start_date')
            ->get()
            ->map(function ($formation) {
                $seatsLeft = $formation->max_capacity - $formation->enrollments->count();
                return [
                    'id' => $formation->id,
                    'title' => $formation->title,
                    'description' => $formation->description,
                    'start_date' => $formation->start_date,
                    'end_date' => $formation->end_date,
                    'duration' => $formation->duration,
                    'max_capacity' => $formation->max_capacity,
                    'seats_left' => $seatsLeft,
                    'status' => $formation->status,
                    'trainer' => [
                        'id' => $formation->trainer->id,
                        'name' => $formation->trainer->firstname . ' ' . $formation->trainer->lastname,
                        'specialities' => $formation->trainer->trainerProfile?->specialities,
                        'experience' => $formation->trainer->trainerProfile?->experience,
                    ],
                    'room' => [
                        'name' => $formation->room->name,
                        'capacity' => $formation->room->capacity,
                    ]
                ];
            });

        return response()->json($formations);
    }

    public function getAboutUsStats()
    {
        $stats = [
            'students' => [
                'count' => User::where('role', 'student')->where('is_active', true)->count(),
                'label' => 'Active Students',
                'icon' => 'student' // You can use this in frontend to show the icon
            ],
            'trainers' => [
                'count' => User::where('role', 'trainer')->where('is_active', true)->count(),
                'label' => 'Expert Trainers',
                'icon' => 'trainer'
            ],
            'courses' => [
                'count' => Formation::where('status', '!=', 'cancelled')->count(),
                'label' => 'Courses',
                'icon' => 'course'
            ],
            'success_rate' => [
                'count' => '95%',
                'label' => 'Success Rate',
                'icon' => 'trophy'
            ]
        ];

        return response()->json($stats);
    }
} 