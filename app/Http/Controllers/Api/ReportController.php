<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Faculty;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function studentsByCourse(Request $request)
    {
        $query = Student::with(['course', 'department'])
            ->notArchived();

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $students = $query->get();
        
        return response()->json([
            'students' => $students,
            'total' => $students->count(),
            'course_filter' => $request->course_id
        ]);
    }

    public function facultyByDepartment(Request $request)
    {
        $query = Faculty::with('department')
            ->notArchived();

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        $faculty = $query->get();
        
        return response()->json([
            'faculty' => $faculty,
            'total' => $faculty->count(),
            'department_filter' => $request->department_id
        ]);
    }
}

