<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\TrainerController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\StudentEvaluationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PublicController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('public/formations', [PublicController::class, 'getPublicFormations']);
Route::get('public/trainers', [PublicController::class, 'getActiveTrainers']);
Route::get('public/formations/search', [PublicController::class, 'searchFormations']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);

    Route::apiResource('formations', FormationController::class);
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('trainers', TrainerController::class);
    Route::apiResource('enrollments', EnrollmentController::class);
    Route::apiResource('evaluations', EvaluationController::class);
    Route::apiResource('student-evaluations', StudentEvaluationController::class);
    Route::get('users', [UserController::class, 'index']);

    Route::prefix('dashboard')->group(function () {
        Route::get('/admin', [DashboardController::class, 'adminStats'])->middleware('role:admin');
        Route::get('/trainer', [DashboardController::class, 'trainerStats'])->middleware('role:trainer');
        Route::get('/student', [DashboardController::class, 'studentStats'])->middleware('role:student');
    });
}); 