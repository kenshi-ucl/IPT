import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Faculty = () => {
    const [faculty, setFaculty] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');

    const [formData, setFormData] = useState({
        employee_id: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        phone: '',
        birth_date: '',
        gender: '',
        address: '',
        position: '',
        qualification: '',
        hire_date: '',
        salary: '',
        department_id: '',
        status: 'active'
    });

    useEffect(() => {
        fetchFaculty();
        fetchDepartments();
    }, [searchTerm, departmentFilter]);

    const fetchFaculty = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (departmentFilter) params.append('department_id', departmentFilter);

            const response = await axios.get(`/faculty?${params}`);
            setFaculty(response.data.data || []);
        } catch (error) {
            console.error('Error fetching faculty:', error);
        } finally {
            setLoading(false);
        }
    };

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
            if (editingFaculty) {
                await axios.put(`/faculty/${editingFaculty.id}`, formData);
            } else {
                await axios.post('/faculty', formData);
            }
            fetchFaculty();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving faculty:', error);
        }
    };

    const handleEdit = (facultyMember) => {
        setEditingFaculty(facultyMember);
        setFormData({
            ...facultyMember,
            birth_date: facultyMember.birth_date ? facultyMember.birth_date.split('T')[0] : '',
            hire_date: facultyMember.hire_date ? facultyMember.hire_date.split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to archive this faculty member?')) {
            try {
                await axios.delete(`/faculty/${id}`);
                fetchFaculty();
            } catch (error) {
                console.error('Error deleting faculty:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            employee_id: '',
            first_name: '',
            last_name: '',
            middle_name: '',
            email: '',
            phone: '',
            birth_date: '',
            gender: '',
            address: '',
            position: '',
            qualification: '',
            hire_date: '',
            salary: '',
            department_id: '',
            status: 'active'
        });
        setEditingFaculty(null);
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    if (loading) {
        return <div className="text-center py-8">Loading faculty...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Faculty Management</h2>
                <button
                    onClick={openModal}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Add Faculty
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Search faculty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Faculty Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {faculty.map((facultyMember) => (
                        <li key={facultyMember.id}>
                            <div className="px-4 py-4 flex items-center justify-between">
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
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(facultyMember)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(facultyMember.id)}
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
                                {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Employee ID"
                                        value={formData.employee_id}
                                        onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
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
                                    <input
                                        type="text"
                                        placeholder="Position"
                                        value={formData.position}
                                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Qualification"
                                        value={formData.qualification}
                                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                    <input
                                        type="date"
                                        placeholder="Hire Date"
                                        value={formData.hire_date}
                                        onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                        required
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Salary"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2"
                                    />
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
                                    {editingFaculty && (
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            className="border border-gray-300 rounded px-3 py-2"
                                        >
                                            <option value="active">Active</option>
                                            <option value="retired">Retired</option>
                                            <option value="resigned">Resigned</option>
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
                                        {editingFaculty ? 'Update' : 'Create'}
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

export default Faculty;

