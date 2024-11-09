<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'is_active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function trainerProfile()
    {
        return $this->hasOne(TrainerProfile::class);
    }

    public function formations()
    {
        return $this->hasMany(Formation::class, 'trainer_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function studentEvaluations()
    {
        return $this->hasMany(StudentEvaluation::class);
    }
}
