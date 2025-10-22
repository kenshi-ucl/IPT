import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './auth/Login';
import Dashboard from './dashboard/Dashboard';
import Students from './students/Students';
import Faculty from './faculty/Faculty';
import SystemSettings from './settings/SystemSettings';
import Reports from './reports/Reports';
import Profile from './profile/Profile';

// Configure axios defaults
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

const App = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Only fetch user if we don't already have user data
            if (!user) {
                fetchUser();
            }
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/profile');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            // Don't auto-logout for now - the user is logged in successfully
            // logout();
        }
    };

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Don't fetch user profile immediately - we already have the user data
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setActiveTab('dashboard');
    };

    const renderContent = () => {
        if (!user) {
            return <Login onLogin={login} />;
        }

        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'students':
                return <Students />;
            case 'faculty':
                return <Faculty />;
            case 'settings':
                return <SystemSettings />;
            case 'reports':
                return <Reports />;
            case 'profile':
                return <Profile user={user} onUpdate={fetchUser} onLogout={logout} />;
            default:
                return <Dashboard />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {user && (
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <h1 className="text-xl font-semibold text-gray-900">
                                        Student & Faculty Management
                                    </h1>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    {[
                                        { id: 'dashboard', label: 'Dashboard' },
                                        { id: 'students', label: 'Students' },
                                        { id: 'faculty', label: 'Faculty' },
                                        { id: 'settings', label: 'System Settings' },
                                        { id: 'reports', label: 'Reports' },
                                        { id: 'profile', label: 'My Profile' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`${
                                                activeTab === tab.id
                                                    ? 'border-blue-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-700">
                                    Welcome, {user.name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            )}
            
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;

