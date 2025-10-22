<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Create default admin user
        \App\User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '1234567890',
            'is_active' => true,
        ]);

        // Create sample departments
        $csDept = \App\Models\Department::create([
            'name' => 'Computer Science',
            'code' => 'CS',
            'description' => 'Computer Science Department',
            'is_active' => true,
        ]);

        $itDept = \App\Models\Department::create([
            'name' => 'Information Technology',
            'code' => 'IT',
            'description' => 'Information Technology Department',
            'is_active' => true,
        ]);

        $businessDept = \App\Models\Department::create([
            'name' => 'Business Administration',
            'code' => 'BA',
            'description' => 'Business Administration Department',
            'is_active' => true,
        ]);

        // Create sample courses
        \App\Models\Course::create([
            'name' => 'Bachelor of Science in Computer Science',
            'code' => 'BSCS',
            'description' => 'Computer Science Program',
            'department_id' => $csDept->id,
            'is_active' => true,
        ]);

        \App\Models\Course::create([
            'name' => 'Bachelor of Science in Information Technology',
            'code' => 'BSIT',
            'description' => 'Information Technology Program',
            'department_id' => $itDept->id,
            'is_active' => true,
        ]);

        \App\Models\Course::create([
            'name' => 'Bachelor of Science in Business Administration',
            'code' => 'BSBA',
            'description' => 'Business Administration Program',
            'department_id' => $businessDept->id,
            'is_active' => true,
        ]);

        // Create sample academic year
        \App\Models\AcademicYear::create([
            'year' => '2024-2025',
            'semester' => '1st Semester',
            'start_date' => '2024-08-01',
            'end_date' => '2024-12-15',
            'is_active' => true,
        ]);

        \App\Models\AcademicYear::create([
            'year' => '2024-2025',
            'semester' => '2nd Semester',
            'start_date' => '2025-01-15',
            'end_date' => '2025-05-30',
            'is_active' => true,
        ]);

        // Run the sample data seeder
        $this->call(SampleDataSeeder::class);
    }
}