<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Course;
use App\Models\Department;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['course', 'department', 'academicYear'])
            ->notArchived();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('student_number', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by course
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        // Filter by department
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_number' => 'required|unique:students',
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:students',
            'phone' => 'nullable',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'address' => 'required',
            'course_id' => 'required|exists:courses,id',
            'department_id' => 'required|exists:departments,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'year_level' => 'required|in:1st Year,2nd Year,3rd Year,4th Year',
            'guardian_name' => 'nullable',
            'guardian_phone' => 'nullable',
        ]);

        $student = Student::create($validated);
        return response()->json($student->load(['course', 'department', 'academicYear']), 201);
    }

    public function show($id)
    {
        $student = Student::with(['course', 'department', 'academicYear'])->findOrFail($id);
        return response()->json($student);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        
        $validated = $request->validate([
            'student_number' => 'required|unique:students,student_number,' . $id,
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:students,email,' . $id,
            'phone' => 'nullable',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'address' => 'required',
            'course_id' => 'required|exists:courses,id',
            'department_id' => 'required|exists:departments,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'year_level' => 'required|in:1st Year,2nd Year,3rd Year,4th Year',
            'status' => 'required|in:active,graduated,dropped,transferred',
            'guardian_name' => 'nullable',
            'guardian_phone' => 'nullable',
        ]);

        $student->update($validated);
        return response()->json($student->load(['course', 'department', 'academicYear']));
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->update(['is_archived' => true]);
        return response()->json(['message' => 'Student archived successfully']);
    }

    public function getCourses()
    {
        return response()->json(Course::active()->get());
    }

    public function getDepartments()
    {
        return response()->json(Department::active()->get());
    }

    public function getAcademicYears()
    {
        return response()->json(AcademicYear::active()->get());
    }
}

