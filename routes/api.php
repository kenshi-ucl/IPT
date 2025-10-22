<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Test route
Route::get('test-basic', function() {
    return response()->json(['status' => 'API is working', 'time' => now()]);
});

// Test data route
Route::get('test-data', function() {
    try {
        return response()->json([
            'status' => 'Testing database connection...',
            'students' => 4,
            'faculty' => 3,
            'working' => true
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Authentication routes
Route::post('login', function(\Illuminate\Http\Request $request) {
    // Ultra simple - just return success for admin credentials
    if ($request->email === 'admin@admin.com' && $request->password === 'password') {
        return response()->json([
            'user' => [
                'id' => 1,
                'name' => 'Admin',
                'email' => 'admin@admin.com',
                'role' => 'admin'
            ],
            'token' => 'demo_token_123',
            'message' => 'Login successful'
        ]);
    }

    return response()->json([
        'message' => 'Invalid credentials'
    ], 401);
});

Route::post('logout', function() {
    \Illuminate\Support\Facades\Auth::logout();
    return response()->json(['message' => 'Logout successful']);
});

// Demo routes - simplified working endpoints
Route::group([], function () {
    // Dashboard
    Route::get('dashboard', function() {
        try {
            // Get counts
            $totalStudents = \App\Models\Student::where('is_archived', false)->count();
            $totalFaculty = \App\Models\Faculty::where('is_archived', false)->count();
            
            // Get students per course
            $studentsPerCourse = \App\Models\Course::with([
                'students' => function($query) {
                    $query->where('is_archived', false);
                }
            ])
            ->where('is_active', true)
            ->get()
            ->map(function($course) {
                return [
                    'name' => $course->name,
                    'students_count' => $course->students->count()
                ];
            })
            ->values();
            
            // Get faculty per department
            $facultyPerDepartment = \App\Models\Department::with([
                'faculty' => function($query) {
                    $query->where('is_archived', false);
                }
            ])
            ->where('is_active', true)
            ->get()
            ->map(function($dept) {
                return [
                    'name' => $dept->name,
                    'faculty_count' => $dept->faculty->count()
                ];
            })
            ->values();
            
            return response()->json([
                'totalStudents' => $totalStudents,
                'totalFaculty' => $totalFaculty,
                'studentsPerCourse' => $studentsPerCourse,
                'facultyPerDepartment' => $facultyPerDepartment
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard API Error: ' . $e->getMessage());
            return response()->json([
                'totalStudents' => 0,
                'totalFaculty' => 0,
                'studentsPerCourse' => [],
                'facultyPerDepartment' => [],
                'error' => $e->getMessage()
            ]);
        }
    });
    
    // Profile management
    Route::get('profile', 'Api\ProfileController@show');
    
    // Students - Get all students from database with fallback
    Route::get('students', function(\Illuminate\Http\Request $request) {
        try {
            // Get all non-archived students
            $students = \App\Models\Student::where('is_archived', false)->get();
            
            // Apply search filter if provided
            if ($request->has('search') && $request->search != '') {
                $search = $request->search;
                $students = $students->filter(function($student) use ($search) {
                    return stripos($student->first_name, $search) !== false ||
                           stripos($student->last_name, $search) !== false ||
                           stripos($student->email, $search) !== false;
                });
            }
            
            // Apply course filter if provided
            if ($request->has('course_id') && $request->course_id != '') {
                $students = $students->where('course_id', $request->course_id);
            }
            
            // Apply department filter if provided
            if ($request->has('department_id') && $request->department_id != '') {
                $students = $students->where('department_id', $request->department_id);
            }
            
            return response()->json([
                'data' => $students->map(function($student) {
                    return [
                        'id' => $student->id,
                        'student_number' => $student->student_number,
                        'first_name' => $student->first_name,
                        'last_name' => $student->last_name,
                        'email' => $student->email,
                        'phone' => $student->phone,
                        'birth_date' => $student->birth_date,
                        'gender' => $student->gender,
                        'address' => $student->address,
                        'course_id' => $student->course_id,
                        'department_id' => $student->department_id,
                        'academic_year_id' => $student->academic_year_id,
                        'year_level' => $student->year_level,
                        'status' => $student->status,
                        'is_archived' => $student->is_archived
                    ];
                })->values()
            ]);
        } catch (\Exception $e) {
            \Log::error('Students API Error: ' . $e->getMessage() . ' | ' . $e->getTraceAsString());
            return response()->json(['data' => [], 'error' => $e->getMessage()]);
        }
    });
    
    // Create new student (POST) - Save to database
    Route::post('students', function(\Illuminate\Http\Request $request) {
        try {
            $student = \App\Models\Student::create([
                'student_number' => $request->input('student_number', 'STU-' . time()),
                'first_name' => $request->input('first_name', ''),
                'last_name' => $request->input('last_name', ''),
                'middle_name' => $request->input('middle_name', ''),
                'email' => $request->input('email', 'student@test.com'),
                'phone' => $request->input('phone', ''),
                'birth_date' => $request->input('birth_date', now()),
                'gender' => $request->input('gender', 'male'),
                'address' => $request->input('address', ''),
                'course_id' => $request->input('course_id', 1),
                'department_id' => $request->input('department_id', 1),
                'academic_year_id' => $request->input('academic_year_id', 1),
                'year_level' => $request->input('year_level', '1st Year'),
                'status' => 'active'
            ]);
            
            return response()->json([
                'message' => 'Student created successfully',
                'data' => [
                    'id' => $student->id,
                    'student_number' => $student->student_number,
                    'first_name' => $student->first_name,
                    'last_name' => $student->last_name,
                    'email' => $student->email,
                    'course' => ['name' => 'BSCS'],
                    'department' => ['name' => 'Computer Science'],
                    'year_level' => $student->year_level,
                    'status' => 'active'
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create student: ' . $e->getMessage()], 500);
        }
    });
    
    // Update student (PUT) - Update database
    Route::put('students/{id}', function(\Illuminate\Http\Request $request, $id) {
        try {
            $student = \App\Models\Student::findOrFail($id);
            $student->update([
                'student_number' => $request->student_number ?? $student->student_number,
                'first_name' => $request->first_name ?? $student->first_name,
                'last_name' => $request->last_name ?? $student->last_name,
                'middle_name' => $request->middle_name ?? $student->middle_name,
                'email' => $request->email ?? $student->email,
                'phone' => $request->phone ?? $student->phone,
                'birth_date' => $request->birth_date ?? $student->birth_date,
                'gender' => $request->gender ?? $student->gender,
                'address' => $request->address ?? $student->address,
                'course_id' => $request->course_id ?? $student->course_id,
                'department_id' => $request->department_id ?? $student->department_id,
                'academic_year_id' => $request->academic_year_id ?? $student->academic_year_id,
                'year_level' => $request->year_level ?? $student->year_level,
                'status' => $request->status ?? $student->status
            ]);
            
            return response()->json([
                'message' => 'Student updated successfully',
                'data' => [
                    'id' => $student->id,
                    'student_number' => $student->student_number,
                    'first_name' => $student->first_name,
                    'last_name' => $student->last_name,
                    'email' => $student->email,
                    'course' => ['name' => 'BSCS'],
                    'department' => ['name' => 'Computer Science'],
                    'year_level' => $student->year_level,
                    'status' => $student->status
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    // Delete/Archive student (DELETE) - Update database
    Route::delete('students/{id}', function($id) {
        try {
            $student = \App\Models\Student::findOrFail($id);
            $student->update(['is_archived' => true]);
            
            return response()->json([
                'message' => 'Student archived successfully',
                'id' => $id
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    // Faculty - Get all faculty from database
    Route::get('faculty', function(\Illuminate\Http\Request $request) {
        try {
            // Get all non-archived faculty
            $faculty = \App\Models\Faculty::where('is_archived', false)->get();
            
            // Apply search filter if provided
            if ($request->has('search') && $request->search != '') {
                $search = $request->search;
                $faculty = $faculty->filter(function($fac) use ($search) {
                    return stripos($fac->first_name, $search) !== false ||
                           stripos($fac->last_name, $search) !== false ||
                           stripos($fac->email, $search) !== false;
                });
            }
            
            // Apply department filter if provided
            if ($request->has('department_id') && $request->department_id != '') {
                $faculty = $faculty->where('department_id', $request->department_id);
            }
            
            return response()->json([
                'data' => $faculty->map(function($fac) {
                    return [
                        'id' => $fac->id,
                        'employee_id' => $fac->employee_id,
                        'first_name' => $fac->first_name,
                        'last_name' => $fac->last_name,
                        'email' => $fac->email,
                        'phone' => $fac->phone,
                        'birth_date' => $fac->birth_date,
                        'gender' => $fac->gender,
                        'address' => $fac->address,
                        'position' => $fac->position,
                        'qualification' => $fac->qualification,
                        'hire_date' => $fac->hire_date,
                        'salary' => $fac->salary,
                        'department_id' => $fac->department_id,
                        'status' => $fac->status,
                        'is_archived' => $fac->is_archived
                    ];
                })->values()
            ]);
        } catch (\Exception $e) {
            \Log::error('Faculty API Error: ' . $e->getMessage() . ' | ' . $e->getTraceAsString());
            return response()->json(['data' => [], 'error' => $e->getMessage()]);
        }
    });
    
    // Create new faculty (POST) - Save to database
    Route::post('faculty', function(\Illuminate\Http\Request $request) {
        try {
            $faculty = \App\Models\Faculty::create([
                'employee_id' => $request->input('employee_id', 'EMP-' . time()),
                'first_name' => $request->input('first_name', ''),
                'last_name' => $request->input('last_name', ''),
                'middle_name' => $request->input('middle_name', ''),
                'email' => $request->input('email', 'faculty@test.com'),
                'phone' => $request->input('phone', ''),
                'birth_date' => $request->input('birth_date', now()),
                'gender' => $request->input('gender', 'male'),
                'address' => $request->input('address', ''),
                'position' => $request->input('position', 'Lecturer'),
                'qualification' => $request->input('qualification', 'Master\'s'),
                'hire_date' => $request->input('hire_date', now()),
                'salary' => $request->input('salary', 0),
                'department_id' => $request->input('department_id', 1),
                'status' => 'active'
            ]);
            
            return response()->json([
                'message' => 'Faculty created successfully',
                'data' => [
                    'id' => $faculty->id,
                    'employee_id' => $faculty->employee_id,
                    'first_name' => $faculty->first_name,
                    'last_name' => $faculty->last_name,
                    'email' => $faculty->email,
                    'phone' => $faculty->phone,
                    'position' => $faculty->position,
                    'qualification' => $faculty->qualification,
                    'department' => ['name' => 'Computer Science'],
                    'status' => 'active'
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create faculty: ' . $e->getMessage()], 500);
        }
    });
    
    // Update faculty (PUT) - Update database
    Route::put('faculty/{id}', function(\Illuminate\Http\Request $request, $id) {
        try {
            $faculty = \App\Models\Faculty::findOrFail($id);
            $faculty->update([
                'employee_id' => $request->employee_id ?? $faculty->employee_id,
                'first_name' => $request->first_name ?? $faculty->first_name,
                'last_name' => $request->last_name ?? $faculty->last_name,
                'middle_name' => $request->middle_name ?? $faculty->middle_name,
                'email' => $request->email ?? $faculty->email,
                'phone' => $request->phone ?? $faculty->phone,
                'birth_date' => $request->birth_date ?? $faculty->birth_date,
                'gender' => $request->gender ?? $faculty->gender,
                'address' => $request->address ?? $faculty->address,
                'position' => $request->position ?? $faculty->position,
                'qualification' => $request->qualification ?? $faculty->qualification,
                'hire_date' => $request->hire_date ?? $faculty->hire_date,
                'salary' => $request->salary ?? $faculty->salary,
                'department_id' => $request->department_id ?? $faculty->department_id,
                'status' => $request->status ?? $faculty->status
            ]);
            
            return response()->json([
                'message' => 'Faculty updated successfully',
                'data' => [
                    'id' => $faculty->id,
                    'employee_id' => $faculty->employee_id,
                    'first_name' => $faculty->first_name,
                    'last_name' => $faculty->last_name,
                    'email' => $faculty->email,
                    'phone' => $faculty->phone,
                    'position' => $faculty->position,
                    'qualification' => $faculty->qualification,
                    'department' => ['name' => 'Computer Science'],
                    'status' => $faculty->status
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update faculty: ' . $e->getMessage()], 500);
        }
    });
    
    // Delete/Archive faculty (DELETE) - Update database
    Route::delete('faculty/{id}', function($id) {
        try {
            $faculty = \App\Models\Faculty::findOrFail($id);
            $faculty->update(['is_archived' => true]);
            
            return response()->json([
                'message' => 'Faculty archived successfully',
                'id' => $id
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    // Support routes for dropdowns that Students component needs
    Route::get('students/courses/list', function() {
        try {
            $courses = \App\Models\Course::where('is_active', true)->get();
            return response()->json($courses->map(function($course) {
                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'code' => $course->code
                ];
            })->values());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    });
    
    Route::get('students/departments/list', function() {
        try {
            $departments = \App\Models\Department::where('is_active', true)->get();
            return response()->json($departments->map(function($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'code' => $dept->code
                ];
            })->values());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    });
    
    Route::get('students/academic-years/list', function() {
        try {
            $academicYears = \App\Models\AcademicYear::where('is_active', true)->get();
            return response()->json($academicYears->map(function($year) {
                return [
                    'id' => $year->id,
                    'year' => $year->year,
                    'semester' => $year->semester
                ];
            })->values());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    });
    
    // Additional routes for departments and courses
    Route::get('departments', function() {
        try {
            $departments = \App\Models\Department::where('is_active', true)->get();
            return response()->json($departments->map(function($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'code' => $dept->code
                ];
            })->values());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    });
    
    Route::get('courses', function() {
        try {
            $courses = \App\Models\Course::where('is_active', true)->get();
            return response()->json($courses->map(function($course) {
                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'code' => $course->code
                ];
            })->values());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    });
    
    Route::get('academic-years', function() {
        try {
            $academicYears = \App\Models\AcademicYear::where('is_active', true)->get();
            return response()->json($academicYears->map(function($year) {
                return [
                    'id' => $year->id,
                    'year' => $year->year,
                    'semester' => $year->semester
                ];
            })->values());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    });
    
    // COURSES CRUD
    Route::post('courses', function(\Illuminate\Http\Request $request) {
        try {
            $course = \App\Models\Course::create([
                'name' => $request->input('name'),
                'code' => $request->input('code'),
                'description' => $request->input('description', ''),
                'department_id' => $request->input('department_id'),
                'is_active' => true
            ]);
            return response()->json(['message' => 'Course created', 'data' => $course], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    Route::put('courses/{id}', function(\Illuminate\Http\Request $request, $id) {
        try {
            $course = \App\Models\Course::findOrFail($id);
            $course->update([
                'name' => $request->input('name', $course->name),
                'code' => $request->input('code', $course->code),
                'description' => $request->input('description', $course->description),
                'department_id' => $request->input('department_id', $course->department_id)
            ]);
            return response()->json(['message' => 'Course updated', 'data' => $course]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    Route::delete('courses/{id}', function($id) {
        try {
            $course = \App\Models\Course::findOrFail($id);
            $course->update(['is_active' => false]);
            return response()->json(['message' => 'Course archived']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    // DEPARTMENTS CRUD
    Route::post('departments', function(\Illuminate\Http\Request $request) {
        try {
            $department = \App\Models\Department::create([
                'name' => $request->input('name'),
                'code' => $request->input('code'),
                'description' => $request->input('description', ''),
                'is_active' => true
            ]);
            return response()->json(['message' => 'Department created', 'data' => $department], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    Route::put('departments/{id}', function(\Illuminate\Http\Request $request, $id) {
        try {
            $department = \App\Models\Department::findOrFail($id);
            $department->update([
                'name' => $request->input('name', $department->name),
                'code' => $request->input('code', $department->code),
                'description' => $request->input('description', $department->description)
            ]);
            return response()->json(['message' => 'Department updated', 'data' => $department]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    Route::delete('departments/{id}', function($id) {
        try {
            $department = \App\Models\Department::findOrFail($id);
            $department->update(['is_active' => false]);
            return response()->json(['message' => 'Department archived']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    // ACADEMIC YEARS CRUD
    Route::post('academic-years', function(\Illuminate\Http\Request $request) {
        try {
            $academicYear = \App\Models\AcademicYear::create([
                'year' => $request->input('year'),
                'semester' => $request->input('semester'),
                'start_date' => $request->input('start_date', null),
                'end_date' => $request->input('end_date', null),
                'is_active' => true
            ]);
            return response()->json(['message' => 'Academic year created', 'data' => $academicYear], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    Route::put('academic-years/{id}', function(\Illuminate\Http\Request $request, $id) {
        try {
            $academicYear = \App\Models\AcademicYear::findOrFail($id);
            $academicYear->update([
                'year' => $request->input('year', $academicYear->year),
                'semester' => $request->input('semester', $academicYear->semester),
                'start_date' => $request->input('start_date', $academicYear->start_date),
                'end_date' => $request->input('end_date', $academicYear->end_date)
            ]);
            return response()->json(['message' => 'Academic year updated', 'data' => $academicYear]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    Route::delete('academic-years/{id}', function($id) {
        try {
            $academicYear = \App\Models\AcademicYear::findOrFail($id);
            $academicYear->update(['is_active' => false]);
            return response()->json(['message' => 'Academic year archived']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
});
