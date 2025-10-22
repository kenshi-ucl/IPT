<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalStudents = Student::notArchived()->count();
        $totalFaculty = Faculty::notArchived()->count();
        
        $studentsPerCourse = Course::withCount(['students' => function($query) {
            $query->notArchived();
        }])->get();
        
        $facultyPerDepartment = Department::withCount(['faculty' => function($query) {
            $query->notArchived();
        }])->get();
        
        return response()->json([
            'totalStudents' => $totalStudents,
            'totalFaculty' => $totalFaculty,
            'studentsPerCourse' => $studentsPerCourse,
            'facultyPerDepartment' => $facultyPerDepartment,
        ]);
    }
}

