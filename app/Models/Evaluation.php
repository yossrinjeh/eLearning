<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Evaluation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'formation_id',
        'title',
        'description',
        'date',
        'is_active'
    ];

    protected $casts = [
        'date' => 'datetime',
        'is_active' => 'boolean'
    ];

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    public function studentEvaluations(): HasMany
    {
        return $this->hasMany(StudentEvaluation::class);
    }
}
