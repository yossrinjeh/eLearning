<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Room;
use App\Models\Formation;
use App\Models\TrainerProfile;
use App\Models\Enrollment;
use App\Models\Evaluation;
use App\Models\StudentEvaluation;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin
        User::create([
            'firstname' => 'Admin',
            'lastname' => 'User',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create Rooms
        $rooms = [
            ['name' => 'Room 101', 'capacity' => 30, 'equipment' => 'Projector, Whiteboard, 15 Computers', 'status' => 'available'],
            ['name' => 'Room 102', 'capacity' => 25, 'equipment' => 'Projector, Whiteboard', 'status' => 'available'],
            ['name' => 'Lab 201', 'capacity' => 20, 'equipment' => 'Projector, 20 Computers, Development Tools', 'status' => 'available'],
            ['name' => 'Conference Room A', 'capacity' => 40, 'equipment' => 'Large Screen, Audio System', 'status' => 'available'],
            ['name' => 'Workshop Room', 'capacity' => 15, 'equipment' => 'Workbenches, Tools, 3D Printer', 'status' => 'available'],
        ];

        foreach ($rooms as $room) {
            Room::create($room);
        }

        // Create Trainers with Profiles
        $trainers = [
            [
                'user' => [
                    'firstname' => 'John',
                    'lastname' => 'Smith',
                    'email' => 'john.smith@test.com',
                    'password' => Hash::make('password'),
                    'role' => 'trainer',
                    'is_active' => true,
                ],
                'profile' => [
                    'specialities' => 'Laravel, Vue.js, React',
                    'experience' => '5 years in web development training',
                    'cv_path' => 'cvs/trainer1.pdf',
                ]
            ],
            [
                'user' => [
                    'firstname' => 'Sarah',
                    'lastname' => 'Johnson',
                    'email' => 'sarah.johnson@test.com',
                    'password' => Hash::make('password'),
                    'role' => 'trainer',
                    'is_active' => true,
                ],
                'profile' => [
                    'specialities' => 'Python, Data Science, Machine Learning',
                    'experience' => '7 years in data science education',
                    'cv_path' => 'cvs/trainer2.pdf',
                ]
            ],
            [
                'user' => [
                    'firstname' => 'Michael',
                    'lastname' => 'Brown',
                    'email' => 'michael.brown@test.com',
                    'password' => Hash::make('password'),
                    'role' => 'trainer',
                    'is_active' => false,
                ],
                'profile' => [
                    'specialities' => 'Mobile Development, Flutter, React Native',
                    'experience' => '4 years in mobile app development',
                    'cv_path' => 'cvs/trainer3.pdf',
                ]
            ],
        ];

        foreach ($trainers as $trainer) {
            $user = User::create($trainer['user']);
            $trainer['profile']['user_id'] = $user->id;
            TrainerProfile::create($trainer['profile']);
        }

        // Create Students
        $students = [];
        for ($i = 1; $i <= 20; $i++) {
            $students[] = [
                'firstname' => "Student{$i}",
                'lastname' => "User{$i}",
                'email' => "student{$i}@test.com",
                'password' => Hash::make('password'),
                'role' => 'student',
                'is_active' => true,
            ];
        }

        foreach ($students as $student) {
            User::create($student);
        }

        // Create Formations
        $formations = [
            [
                'title' => 'Advanced Laravel Development',
                'description' => 'Master Laravel with advanced concepts and real-world applications',
                'start_date' => now()->addDays(15),
                'end_date' => now()->addDays(45),
                'duration' => 30,
                'max_capacity' => 20,
                'status' => 'upcoming',
                'room_id' => 1,
                'trainer_id' => 2,
            ],
            [
                'title' => 'Data Science Fundamentals',
                'description' => 'Introduction to data science using Python and popular libraries',
                'start_date' => now()->addDays(7),
                'end_date' => now()->addDays(37),
                'duration' => 30,
                'max_capacity' => 15,
                'status' => 'upcoming',
                'room_id' => 3,
                'trainer_id' => 3,
            ],
            [
                'title' => 'Mobile App Development',
                'description' => 'Build cross-platform mobile apps with Flutter',
                'start_date' => now()->addDays(1),
                'end_date' => now()->addDays(30),
                'duration' => 30,
                'max_capacity' => 25,
                'status' => 'ongoing',
                'room_id' => 2,
                'trainer_id' => 4,
            ],
        ];

        foreach ($formations as $formation) {
            Formation::create($formation);
        }

        // Create Enrollments
        $studentIds = User::where('role', 'student')->pluck('id');
        $formationIds = Formation::pluck('id');

        foreach ($studentIds as $studentId) {
            // Enroll each student in 1-3 random formations
            $randomFormations = $formationIds->random(rand(1, 3));
            foreach ($randomFormations as $formationId) {
                Enrollment::create([
                    'user_id' => $studentId,
                    'formation_id' => $formationId,
                    'status' => ['pending', 'accepted', 'completed'][rand(0, 2)],
                    'enrollment_date' => now()->subDays(rand(1, 30)),
                ]);
            }
        }

        // Create Evaluations
        foreach ($formationIds as $formationId) {
            $evaluation = Evaluation::create([
                'formation_id' => $formationId,
                'title' => 'Final Evaluation',
                'description' => 'Final course evaluation covering all topics',
                'date' => now()->addDays(rand(15, 45)),
                'is_active' => true,
            ]);

            // Create student evaluations for completed enrollments
            $completedEnrollments = Enrollment::where('formation_id', $formationId)
                ->where('status', 'completed')
                ->get();

            foreach ($completedEnrollments as $enrollment) {
                StudentEvaluation::create([
                    'evaluation_id' => $evaluation->id,
                    'user_id' => $enrollment->user_id,
                    'score' => rand(60, 100),
                    'comments' => 'Student performance evaluation comments',
                ]);
            }
        }
    }
}
