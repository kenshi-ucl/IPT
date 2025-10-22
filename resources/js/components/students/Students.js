import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        course_id: '',
        department_id: ''
    });

    const [formData, setFormData] = useState({
        student_number: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        phone: '',
        birth_date: '',
        gender: '',
        address: '',
        guardian_name: '',
        guardian_phone: '',
        course_id: '',
        department_id: '',
        academic_year_id: '',
        year_level: '',
        status: 'active'
    });

    useEffect(() => {
        fetchStudents();
        fetchCourses();
        fetchDepartments();
        fetchAcademicYears();
    }, [searchTerm, filters]);

    const fetchStudents = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filters.course_id) params.append('course_id', filters.course_id);
            if (filters.department_id) params.append('department_id', filters.department_id);

            const response = await axios.get(`/students?${params}`);
            setStudents(response.data.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get('/students/courses/list');
            setCourses(response.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCourses([]); // Set empty array on error
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('/students/departments/list');
            setDepartments(response.data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setDepartments([]); // Set empty array on error
        }
    };

    const fetchAcademicYears = async () => {
        try {
            const response = await axios.get('/students/academic-years/list');
            setAcademicYears(response.data || []);
        } catch (error) {
            console.error('Error fetching academic years:', error);
            setAcademicYears([]); // Set empty array on error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await axios.put(`/students/${editingStudent.id}`, formData);
            } else {
                await axios.post('/students', formData);
            }
            fetchStudents();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving student:', error);
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            ...student,
            birth_date: student.birth_date ? student.birth_date.split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this student?')) {
            try {
                await axios.delete(`/students/${id}`);
                fetchStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            student_number: '',
            first_name: '',
            last_name: '',
            middle_name: '',
            email: '',
            phone: '',
            birth_date: '',
            gender: '',
            address: '',
            guardian_name: '',
            guardian_phone: '',
            course_id: '',
            department_id: '',
            academic_year_id: '',
            year_level: '',
            status: 'active'
        });
        setEditingStudent(null);
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    if (loading) {
        return <div className="text-center py-8">Loading students...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
                <button
                    onClick={openModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Student
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2"
                    />
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
            </div>

            {/* Students Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                        <li key={student.id}>
                            <div className="px-4 py-4 flex items-center justify-between">
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
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(student)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Archive
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingStudent ? 'Edit Student' : 'Add New Student'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Student Number"
                                        value={formData.student_number}
                                        onChange={(e) => setFormData({...formData, student_number: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Middle Name"
                                        value={formData.middle_name}
                                        onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                    />
                                    <input
                                        type="date"
                                        placeholder="Birth Date"
                                        value={formData.birth_date}
                                        onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    <select
                                        value={formData.course_id}
                                        onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>{course.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={formData.department_id}
                                        onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={formData.academic_year_id}
                                        onChange={(e) => setFormData({...formData, academic_year_id: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Academic Year</option>
                                        {academicYears.map(year => (
                                            <option key={year.id} value={year.id}>{year.year} - {year.semester}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={formData.year_level}
                                        onChange={(e) => setFormData({...formData, year_level: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Year Level</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                    {editingStudent && (
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            className="border border-gray-300 rounded px-3 py-2"
                                        >
                                            <option value="active">Active</option>
                                            <option value="graduated">Graduated</option>
                                            <option value="dropped">Dropped</option>
                                            <option value="transferred">Transferred</option>
                                        </select>
                                    )}
                                </div>
                                <textarea
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                    rows="3"
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Guardian Name"
                                        value={formData.guardian_name}
                                        onChange={(e) => setFormData({...formData, guardian_name: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Guardian Phone"
                                        value={formData.guardian_phone}
                                        onChange={(e) => setFormData({...formData, guardian_phone: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        {editingStudent ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;

