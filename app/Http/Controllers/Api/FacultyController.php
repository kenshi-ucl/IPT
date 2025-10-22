<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\Department;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        $query = Faculty::with('department')->notArchived();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
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
            'employee_id' => 'required|unique:faculty',
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:faculty',
            'phone' => 'nullable',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'address' => 'required',
            'position' => 'required',
            'qualification' => 'required',
            'hire_date' => 'required|date',
            'salary' => 'nullable|numeric',
            'department_id' => 'required|exists:departments,id',
        ]);

        $faculty = Faculty::create($validated);
        return response()->json($faculty->load('department'), 201);
    }

    public function show($id)
    {
        $faculty = Faculty::with('department')->findOrFail($id);
        return response()->json($faculty);
    }

    public function update(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);
        
        $validated = $request->validate([
            'employee_id' => 'required|unique:faculty,employee_id,' . $id,
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:faculty,email,' . $id,
            'phone' => 'nullable',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'address' => 'required',
            'position' => 'required',
            'qualification' => 'required',
            'hire_date' => 'required|date',
            'salary' => 'nullable|numeric',
            'department_id' => 'required|exists:departments,id',
            'status' => 'required|in:active,retired,resigned',
        ]);

        $faculty->update($validated);
        return response()->json($faculty->load('department'));
    }

    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->update(['is_archived' => true]);
        return response()->json(['message' => 'Faculty archived successfully']);
    }
}

