<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FormationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'duration' => $this->duration,
            'max_capacity' => $this->max_capacity,
            'status' => $this->status,
            'is_active' => $this->is_active,
            'trainer' => new UserResource($this->whenLoaded('trainer')),
            'room' => new RoomResource($this->whenLoaded('room')),
            'enrollments' => EnrollmentResource::collection($this->whenLoaded('enrollments')),
            'evaluations' => EvaluationResource::collection($this->whenLoaded('evaluations')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
} 