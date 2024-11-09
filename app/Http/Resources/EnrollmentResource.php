<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnrollmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'formation_id' => $this->formation_id,
            'status' => $this->status,
            'enrollment_date' => $this->enrollment_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
} 