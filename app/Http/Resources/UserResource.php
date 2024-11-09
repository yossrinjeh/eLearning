<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'address' => $this->address,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'trainer_profile' => $this->when($this->trainerProfile, new TrainerProfileResource($this->trainerProfile)),
            'formations' => $this->when($this->formations, FormationResource::collection($this->formations)),
            'enrollments' => $this->when($this->enrollments, EnrollmentResource::collection($this->enrollments))
        ];
    }
} 