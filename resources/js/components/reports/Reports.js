import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [studentsReport, setStudentsReport] = useState([]);
    const [facultyReport, setFacultyReport] = useState([]);
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        course_id: '',
        department_id: ''
    });

    useEffect(() => {
        fetchCourses();
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (activeTab === 'students') {
            fetchStudentsReport();
        } else {
            fetchFacultyReport();
        }
    }, [activeTab, filters]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('/courses');
            setCourses(response.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCourses([]); // Set empty array on error
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('/departments');
            setDepartments(response.data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setDepartments([]); // Set empty array on error
        }
    };

    const fetchStudentsReport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.course_id) params.append('course_id', filters.course_id);

            const response = await axios.get(`/reports/students-by-course?${params}`);
            setStudentsReport(response.data.students || []);
        } catch (error) {
            console.error('Error fetching students report:', error);
            setStudentsReport([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const fetchFacultyReport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.department_id) params.append('department_id', filters.department_id);

            const response = await axios.get(`/reports/faculty-by-department?${params}`);
            setFacultyReport(response.data.faculty || []);
        } catch (error) {
            console.error('Error fetching faculty report:', error);
            setFacultyReport([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = (data, filename) => {
        if (data.length === 0) return;

        const headers = activeTab === 'students' 
            ? ['Student Number', 'Name', 'Email', 'Course', 'Department', 'Year Level', 'Status']
            : ['Employee ID', 'Name', 'Email', 'Position', 'Department', 'Status'];

        const csvContent = [
            headers.join(','),
            ...data.map(item => {
                if (activeTab === 'students') {
                    return [
                        item.student_number,
                        `"${item.first_name} ${item.last_name}"`,
                        item.email,
                        item.course?.name || '',
                        item.department?.name || '',
                        item.year_level,
                        item.status
                    ].join(',');
                } else {
                    return [
                        item.employee_id,
                        `"${item.first_name} ${item.last_name}"`,
                        item.email,
                        item.position,
                        item.department?.name || '',
                        item.status
                    ].join(',');
                }
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return <div className="text-center py-8">Loading reports...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`${
                            activeTab === 'students'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                    >
                        Students by Course
                    </button>
                    <button
                        onClick={() => setActiveTab('faculty')}
                        className={`${
                            activeTab === 'faculty'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                    >
                        Faculty by Department
                    </button>
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'students' ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Students Report</h3>
                            <button
                                onClick={() => exportToCSV(studentsReport, 'students-report.csv')}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Export CSV
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <select
                                value={filters.course_id}
                                onChange={(e) => setFilters({...filters, course_id: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">All Courses</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {studentsReport.map((student) => (
                                    <li key={student.id}>
                                        <div className="px-4 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {student.first_name} {student.last_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {student.student_number} • {student.course?.name} • {student.year_level}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {student.email}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Status: <span className={`font-medium ${
                                                        student.status === 'active' ? 'text-green-600' :
                                                        student.status === 'graduated' ? 'text-blue-600' :
                                                        'text-red-600'
                                                    }`}>
                                                        {student.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Faculty Report</h3>
                            <button
                                onClick={() => exportToCSV(facultyReport, 'faculty-report.csv')}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Export CSV
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <select
                                value={filters.department_id}
                                onChange={(e) => setFilters({...filters, department_id: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {facultyReport.map((facultyMember) => (
                                    <li key={facultyMember.id}>
                                        <div className="px-4 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {facultyMember.first_name.charAt(0)}{facultyMember.last_name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {facultyMember.first_name} {facultyMember.last_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {facultyMember.employee_id} • {facultyMember.position}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {facultyMember.department?.name} • {facultyMember.email}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Status: <span className={`font-medium ${
                                                        facultyMember.status === 'active' ? 'text-green-600' :
                                                        facultyMember.status === 'retired' ? 'text-yellow-600' :
                                                        'text-red-600'
                                                    }`}>
                                                        {facultyMember.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;

