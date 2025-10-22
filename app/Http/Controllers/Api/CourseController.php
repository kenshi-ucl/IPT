<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with('department')->get();
        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'code' => 'required|unique:courses',
            'description' => 'nullable',
            'department_id' => 'required|exists:departments,id',
        ]);

        $course = Course::create($validated);
        return response()->json($course->load('department'), 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required',
            'code' => 'required|unique:courses,code,' . $id,
            'description' => 'nullable',
            'department_id' => 'required|exists:departments,id',
            'is_active' => 'boolean',
        ]);

        $course->update($validated);
        return response()->json($course->load('department'));
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->update(['is_active' => false]);
        return response()->json(['message' => 'Course archived successfully']);
    }
}

