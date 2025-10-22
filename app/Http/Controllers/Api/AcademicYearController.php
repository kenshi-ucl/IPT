<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        $academicYears = AcademicYear::all();
        return response()->json($academicYears);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required',
            'semester' => 'required|in:1st Semester,2nd Semester,Summer',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $academicYear = AcademicYear::create($validated);
        return response()->json($academicYear, 201);
    }

    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::findOrFail($id);
        
        $validated = $request->validate([
            'year' => 'required',
            'semester' => 'required|in:1st Semester,2nd Semester,Summer',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        $academicYear->update($validated);
        return response()->json($academicYear);
    }

    public function destroy($id)
    {
        $academicYear = AcademicYear::findOrFail($id);
        $academicYear->update(['is_active' => false]);
        return response()->json(['message' => 'Academic year archived successfully']);
    }
}

