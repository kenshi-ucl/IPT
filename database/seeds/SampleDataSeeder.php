<?php

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Faculty;

class SampleDataSeeder extends Seeder
{
    public function run()
    {
        // Create departments first
        $csDept = \App\Models\Department::firstOrCreate(
            ['code' => 'CS'],
            ['name' => 'Computer Science', 'is_active' => true]
        );
        $itDept = \App\Models\Department::firstOrCreate(
            ['code' => 'IT'],
            ['name' => 'Information Technology', 'is_active' => true]
        );
        $businessDept = \App\Models\Department::firstOrCreate(
            ['code' => 'BA'],
            ['name' => 'Business Administration', 'is_active' => true]
        );
        
        // Create courses
        $bscsCourse = \App\Models\Course::firstOrCreate(
            ['code' => 'BSCS'],
            ['name' => 'Bachelor of Science in Computer Science', 'department_id' => $csDept->id, 'is_active' => true]
        );
        $bsitCourse = \App\Models\Course::firstOrCreate(
            ['code' => 'BSIT'],
            ['name' => 'Bachelor of Science in Information Technology', 'department_id' => $itDept->id, 'is_active' => true]
        );
        $bsbaCourse = \App\Models\Course::firstOrCreate(
            ['code' => 'BSBA'],
            ['name' => 'Bachelor of Science in Business Administration', 'department_id' => $businessDept->id, 'is_active' => true]
        );
        
        // Create academic year
        $academicYear = \App\Models\AcademicYear::firstOrCreate(
            ['year' => '2024-2025'],
            ['semester' => '1st Semester', 'is_active' => true]
        );

        // Create sample students
        if ($csDept && $bscsCourse && $academicYear) {
            Student::firstOrCreate(
                ['email' => 'john.doe@student.edu'],
                [
                    'student_number' => 'CS2024001',
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'middle_name' => 'Michael',
                    'phone' => '09123456789',
                    'birth_date' => '2002-05-15',
                    'gender' => 'male',
                    'address' => '123 Main St, City',
                    'guardian_name' => 'Robert Doe',
                    'guardian_phone' => '09187654321',
                    'course_id' => $bscsCourse->id,
                    'department_id' => $csDept->id,
                    'academic_year_id' => $academicYear->id,
                    'year_level' => '2nd Year',
                    'status' => 'active'
                ]
            );

            Student::firstOrCreate(
                ['email' => 'jane.smith@student.edu'],
                [
                    'student_number' => 'CS2024002',
                    'first_name' => 'Jane',
                    'last_name' => 'Smith',
                    'middle_name' => 'Alice',
                    'phone' => '09123456788',
                    'birth_date' => '2003-03-20',
                    'gender' => 'female',
                    'address' => '456 Oak Ave, City',
                    'guardian_name' => 'Mary Smith',
                    'guardian_phone' => '09187654322',
                    'course_id' => $bscsCourse->id,
                    'department_id' => $csDept->id,
                    'academic_year_id' => $academicYear->id,
                    'year_level' => '1st Year',
                    'status' => 'active'
                ]
            );
        }

        if ($itDept && $bsitCourse && $academicYear) {
            Student::firstOrCreate(
                ['email' => 'mark.johnson@student.edu'],
                [
                    'student_number' => 'IT2024001',
                    'first_name' => 'Mark',
                    'last_name' => 'Johnson',
                    'phone' => '09123456787',
                    'birth_date' => '2002-08-10',
                    'gender' => 'male',
                    'address' => '789 Pine St, City',
                    'guardian_name' => 'James Johnson',
                    'guardian_phone' => '09187654323',
                    'course_id' => $bsitCourse->id,
                    'department_id' => $itDept->id,
                    'academic_year_id' => $academicYear->id,
                    'year_level' => '3rd Year',
                    'status' => 'active'
                ]
            );
        }

        if ($businessDept && $bsbaCourse && $academicYear) {
            Student::firstOrCreate(
                ['email' => 'sarah.williams@student.edu'],
                [
                    'student_number' => 'BA2024001',
                    'first_name' => 'Sarah',
                    'last_name' => 'Williams',
                    'phone' => '09123456786',
                    'birth_date' => '2003-01-25',
                    'gender' => 'female',
                    'address' => '321 Elm St, City',
                    'guardian_name' => 'David Williams',
                    'guardian_phone' => '09187654324',
                    'course_id' => $bsbaCourse->id,
                    'department_id' => $businessDept->id,
                    'academic_year_id' => $academicYear->id,
                    'year_level' => '1st Year',
                    'status' => 'active'
                ]
            );
        }

        // Create sample faculty
        if ($csDept) {
            Faculty::firstOrCreate(
                ['email' => 'michael.brown@faculty.edu'],
                [
                    'employee_id' => 'EMP001',
                    'first_name' => 'Dr. Michael',
                    'last_name' => 'Brown',
                    'phone' => '09198765432',
                    'birth_date' => '1980-06-15',
                    'gender' => 'male',
                    'address' => '555 University Ave, City',
                    'position' => 'Professor',
                    'qualification' => 'PhD in Computer Science',
                    'hire_date' => '2015-08-01',
                    'salary' => 75000.00,
                    'department_id' => $csDept->id,
                    'status' => 'active'
                ]
            );
        }

        if ($itDept) {
            Faculty::firstOrCreate(
                ['email' => 'lisa.davis@faculty.edu'],
                [
                    'employee_id' => 'EMP002',
                    'first_name' => 'Dr. Lisa',
                    'last_name' => 'Davis',
                    'phone' => '09198765433',
                    'birth_date' => '1985-04-20',
                    'gender' => 'female',
                    'address' => '777 College Blvd, City',
                    'position' => 'Associate Professor',
                    'qualification' => 'MS in Information Technology',
                    'hire_date' => '2018-01-15',
                    'salary' => 65000.00,
                    'department_id' => $itDept->id,
                    'status' => 'active'
                ]
            );
        }

        if ($businessDept) {
            Faculty::firstOrCreate(
                ['email' => 'robert.wilson@faculty.edu'],
                [
                    'employee_id' => 'EMP003',
                    'first_name' => 'Prof. Robert',
                    'last_name' => 'Wilson',
                    'phone' => '09198765434',
                    'birth_date' => '1975-12-10',
                    'gender' => 'male',
                    'address' => '999 Academic St, City',
                    'position' => 'Department Head',
                    'qualification' => 'MBA, CPA',
                    'hire_date' => '2010-03-01',
                    'salary' => 85000.00,
                    'department_id' => $businessDept->id,
                    'status' => 'active'
                ]
            );
        }

        echo "Sample data created successfully!\n";
        echo "Students: " . Student::count() . "\n";
        echo "Faculty: " . Faculty::count() . "\n";
    }
}
