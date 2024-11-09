<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\TrainerController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\StudentEvaluationController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

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
}); 