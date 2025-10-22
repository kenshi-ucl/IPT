import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemSettings = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'courses':
                    const coursesResponse = await axios.get('/courses');
                    setCourses(coursesResponse.data);
                    break;
                case 'departments':
                    const departmentsResponse = await axios.get('/departments');
                    setDepartments(departmentsResponse.data);
                    break;
                case 'academic-years':
                    const academicYearsResponse = await axios.get('/academic-years');
                    setAcademicYears(academicYearsResponse.data);
                    break;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'courses', label: 'Courses', component: <CoursesTab data={courses} onUpdate={fetchData} /> },
        { id: 'departments', label: 'Departments', component: <DepartmentsTab data={departments} onUpdate={fetchData} /> },
        { id: 'academic-years', label: 'Academic Years', component: <AcademicYearsTab data={academicYears} onUpdate={fetchData} /> }
    ];

    if (loading) {
        return <div className="text-center py-8">Loading settings...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6">
                {tabs.find(tab => tab.id === activeTab)?.component}
            </div>
        </div>
    );
};

// Courses Tab Component
const CoursesTab = ({ data, onUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        department_id: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await axios.put(`/courses/${editingItem.id}`, formData);
            } else {
                await axios.post('/courses', formData);
            }
            onUpdate();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving course:', error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            code: item.code,
            description: item.description,
            department_id: item.department_id
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this course?')) {
            try {
                await axios.delete(`/courses/${id}`);
                onUpdate();
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', code: '', description: '', department_id: '' });
        setEditingItem(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Courses</h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Course
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {data.map((course) => (
                        <li key={course.id}>
                            <div className="px-4 py-4 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                    <div className="text-sm text-gray-500">{course.code}</div>
                                    <div className="text-sm text-gray-500">{course.department?.name}</div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(course)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
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
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {editingItem ? 'Edit Course' : 'Add Course'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Course Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Course Code"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                            <select
                                value={formData.department_id}
                                onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                rows="3"
                            />
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
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Departments Tab Component
const DepartmentsTab = ({ data, onUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await axios.put(`/departments/${editingItem.id}`, formData);
            } else {
                await axios.post('/departments', formData);
            }
            onUpdate();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving department:', error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            code: item.code,
            description: item.description
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this department?')) {
            try {
                await axios.delete(`/departments/${id}`);
                onUpdate();
            } catch (error) {
                console.error('Error deleting department:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', code: '', description: '' });
        setEditingItem(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Departments</h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Add Department
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {data.map((dept) => (
                        <li key={dept.id}>
                            <div className="px-4 py-4 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                                    <div className="text-sm text-gray-500">{dept.code}</div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(dept)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dept.id)}
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
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {editingItem ? 'Edit Department' : 'Add Department'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Department Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Department Code"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                rows="3"
                            />
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
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Academic Years Tab Component
const AcademicYearsTab = ({ data, onUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        year: '',
        semester: '',
        start_date: '',
        end_date: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await axios.put(`/academic-years/${editingItem.id}`, formData);
            } else {
                await axios.post('/academic-years', formData);
            }
            onUpdate();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving academic year:', error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            year: item.year,
            semester: item.semester,
            start_date: item.start_date ? item.start_date.split('T')[0] : '',
            end_date: item.end_date ? item.end_date.split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this academic year?')) {
            try {
                await axios.delete(`/academic-years/${id}`);
                onUpdate();
            } catch (error) {
                console.error('Error deleting academic year:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({ year: '', semester: '', start_date: '', end_date: '' });
        setEditingItem(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Academic Years</h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    Add Academic Year
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {data.map((year) => (
                        <li key={year.id}>
                            <div className="px-4 py-4 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{year.year}</div>
                                    <div className="text-sm text-gray-500">{year.semester}</div>
                                    <div className="text-sm text-gray-500">
                                        {year.start_date} - {year.end_date}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(year)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(year.id)}
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
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {editingItem ? 'Edit Academic Year' : 'Add Academic Year'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Year (e.g., 2024-2025)"
                                value={formData.year}
                                onChange={(e) => setFormData({...formData, year: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                            <select
                                value={formData.semester}
                                onChange={(e) => setFormData({...formData, semester: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            >
                                <option value="">Select Semester</option>
                                <option value="1st Semester">1st Semester</option>
                                <option value="2nd Semester">2nd Semester</option>
                                <option value="Summer">Summer</option>
                            </select>
                            <input
                                type="date"
                                placeholder="Start Date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
                            <input
                                type="date"
                                placeholder="End Date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                required
                            />
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
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                >
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemSettings;

