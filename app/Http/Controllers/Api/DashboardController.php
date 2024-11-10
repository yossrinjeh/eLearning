<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Formation;
use App\Models\Enrollment;
use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function adminStats()
    {
        $stats = [
            'total_users' => [
                'students' => User::where('role', 'student')->count(),
                'trainers' => User::where('role', 'trainer')->count(),
                'pending_trainers' => User::where('role', 'trainer')
                    ->where('is_active', false)->count()
            ],
            'formations' => [
                'total' => Formation::count(),
                'active' => Formation::where('status', 'ongoing')->count(),
                'upcoming' => Formation::where('status', 'upcoming')->count(),
                'completed' => Formation::where('status', 'completed')->count()
            ],
            'enrollments' => [
                'total' => Enrollment::count(),
                'pending' => Enrollment::where('status', 'pending')->count(),
                'accepted' => Enrollment::where('status', 'accepted')->count()
            ],
            'latest_formations' => Formation::with(['trainer', 'room'])
                ->latest()
                ->take(5)
                ->get(),
            'latest_enrollments' => Enrollment::with(['user', 'formation'])
                ->latest()
                ->take(5)
                ->get()
        ];

        return response()->json($stats);
    }

    public function trainerStats(Request $request)
    {
        $trainerId = $request->user()->id;

        $stats = [
            'formations' => [
                'total' => Formation::where('trainer_id', $trainerId)->count(),
                'active' => Formation::where('trainer_id', $trainerId)
                    ->where('status', 'ongoing')
                    ->count(),
                'upcoming' => Formation::where('trainer_id', $trainerId)
                    ->where('status', 'upcoming')
                    ->count()
            ],
            'students' => [
                'total' => Enrollment::whereHas('formation', function($q) use ($trainerId) {
                    $q->where('trainer_id', $trainerId);
                })->count(),
                'active' => Enrollment::whereHas('formation', function($q) use ($trainerId) {
                    $q->where('trainer_id', $trainerId)
                        ->where('status', 'ongoing');
                })->count()
            ],
            'evaluations' => [
                'total' => Evaluation::whereHas('formation', function($q) use ($trainerId) {
                    $q->where('trainer_id', $trainerId);
                })->count()
            ],
            'current_formations' => Formation::where('trainer_id', $trainerId)
                ->where('status', 'ongoing')
                ->with(['room', 'enrollments'])
                ->get(),
            'upcoming_formations' => Formation::where('trainer_id', $trainerId)
                ->where('status', 'upcoming')
                ->with(['room'])
                ->take(5)
                ->get()
        ];

        return response()->json($stats);
    }

    public function studentStats(Request $request)
    {
        $studentId = $request->user()->id;

        $stats = [
            'enrollments' => [
                'total' => Enrollment::where('user_id', $studentId)->count(),
                'active' => Enrollment::where('user_id', $studentId)
                    ->whereHas('formation', function($q) {
                        $q->where('status', 'ongoing');
                    })->count(),
                'completed' => Enrollment::where('user_id', $studentId)
                    ->whereHas('formation', function($q) {
                        $q->where('status', 'completed');
                    })->count()
            ],
            'evaluations' => [
                'total' => Evaluation::whereHas('formation.enrollments', function($q) use ($studentId) {
                    $q->where('user_id', $studentId);
                })->count(),
                'average_score' => DB::table('student_evaluations')
                    ->where('user_id', $studentId)
                    ->avg('score')
            ],
            'current_formations' => Formation::whereHas('enrollments', function($q) use ($studentId) {
                $q->where('user_id', $studentId);
            })
            ->where('status', 'ongoing')
            ->with(['trainer', 'room'])
            ->get(),
            'upcoming_evaluations' => Evaluation::whereHas('formation.enrollments', function($q) use ($studentId) {
                $q->where('user_id', $studentId);
            })
            ->where('date', '>', now())
            ->with('formation')
            ->take(5)
            ->get()
        ];

        return response()->json($stats);
    }
} 