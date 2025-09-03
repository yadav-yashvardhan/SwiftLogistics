import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import DriverProfileForm from '../components/auth/DriverProfileForm';
import { 
    Truck, MapPin, Package, User, Phone, ToggleLeft, ToggleRight, 
    CheckCircle, ArrowRight, Wallet, Star, Navigation, AlertCircle, 
    Loader, Edit, BarChart3, Route as RouteIcon, DollarSign, Trash2 
} from 'lucide-react';

const apiRequest = async (url, method = 'GET', body = null) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No token found. Please log in.");
    const headers = { 'Content-Type': 'application/json', 'x-auth-token': token };
    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const fullUrl = import.meta.env.VITE_API_URL + url;
    console.log('Fetching:', fullUrl); // Debug the URL
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'An API error occurred');
    }
    return response.json();
};

const DriverDashboard = () => {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingTask, setIsUpdatingTask] = useState(null);

    const fetchData = useCallback(async (tab) => {
        try {
            setIsLoading(true);
            setError(null);
            
            if (tab === 'dashboard' || !tab) {
                const [tasksData, statsData, profileData] = await Promise.all([
                    apiRequest('/api/driver/tasks'),
                    apiRequest('/api/driver/stats'),
                    apiRequest('/api/driver/profile').catch(() => ({})) // Fallback to empty object if profile fetch fails
                ]);
                setTasks(tasksData.tasks);
                setStats(statsData.stats);
                setIsAvailable(statsData.stats?.isAvailable ?? true);
                if (Object.keys(profileData).length > 0) {
                    console.log('Profile Data:', profileData); // Debug profile data
                    login({ ...user, ...profileData }, localStorage.getItem('token')); // Update user with latest profile data
                }
            } else if (tab === 'earnings' || tab === 'history') {
                const historyData = await apiRequest('/api/driver/history');
                setHistory(historyData.rides);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [user, login]);

    useEffect(() => {
        if (user?.profileStatus === 'Complete') {
            fetchData(activeTab);
        } else {
            setIsLoading(false);
        }
    }, [activeTab, user, fetchData]);
    
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleToggleAvailability = async () => {
        try {
            const newAvailability = !isAvailable;
            setIsAvailable(newAvailability);
            await apiRequest('/api/driver/availability', 'PUT', { isAvailable: newAvailability });
        } catch (err) {
            setError(err.message);
            setIsAvailable(!isAvailable);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        setIsUpdatingTask(bookingId);
        try {
            await apiRequest(`/api/driver/tasks/${bookingId}/status`, 'PUT', { status: newStatus });
            await fetchData('dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUpdatingTask(null);
        }
    };
    
    const handleProfileUpdate = async (profileData) => {
        setIsUpdatingProfile(true);
        setError(null);
        try {
            const updatedUser = await apiRequest('/api/driver/profile', 'PUT', profileData);
            console.log('Updated User:', updatedUser); // Debug updated user
            login(updatedUser, localStorage.getItem('token')); // Update user context with new profile data
            setIsEditingProfile(false);
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setIsUpdatingProfile(false); 
        }
    };

    const handleClearHistory = async () => {
        if (window.confirm("Are you sure you want to permanently delete your ride history? This action cannot be undone.")) {
            try {
                const response = await apiRequest('/api/driver/history', 'DELETE');
                alert(response.msg);
                setHistory([]);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (user?.profileStatus === 'Pending') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
                    <p className="text-gray-600 mt-2">Provide your details to activate your account and start receiving tasks.</p>
                    {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
                    <DriverProfileForm 
                        initialData={user}
                        onSubmit={handleProfileUpdate}
                        isLoading={isUpdatingProfile}
                        submitButtonText="Save and Activate Profile"
                    />
                </div>
            </div>
        );
    }
    
    if (isLoading || !stats) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <Loader className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4"/>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
                        <p className="mt-1 text-lg text-gray-600">Welcome back, {user?.name || 'Driver'}!</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3 bg-white p-2 rounded-lg shadow">
                        <span className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>{isAvailable ? 'Online' : 'Offline'}</span>
                        <button onClick={handleToggleAvailability}>{isAvailable ? <ToggleRight className="h-8 w-8 text-green-500" /> : <ToggleLeft className="h-8 w-8 text-gray-400" />}</button>
                    </div>
                </div>

                <div className="mb-6 flex space-x-2 border-b border-gray-200">
                    <button onClick={() => handleTabClick('dashboard')} className={`px-4 py-2 font-semibold flex items-center ${activeTab === 'dashboard' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}><BarChart3 className="h-4 w-4 mr-2"/>Dashboard</button>
                    <button onClick={() => handleTabClick('earnings')} className={`px-4 py-2 font-semibold flex items-center ${activeTab === 'earnings' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}><Wallet className="h-4 w-4 mr-2"/>Earnings</button>
                    <button onClick={() => handleTabClick('history')} className={`px-4 py-2 font-semibold flex items-center ${activeTab === 'history' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}><RouteIcon className="h-4 w-4 mr-2"/>Ride History</button>
                    <button onClick={() => handleTabClick('profile')} className={`px-4 py-2 font-semibold flex items-center ${activeTab === 'profile' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}><User className="h-4 w-4 mr-2"/>My Profile</button>
                </div>

                {error && <div className="my-4 text-center p-4 bg-red-100 text-red-700 rounded-lg"><AlertCircle className="inline-block w-5 h-5 mr-2"/>Error: {error}</div>}

                {activeTab === 'dashboard' && (
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-md"><p className="text-sm text-gray-500">Pending</p><p className="text-3xl font-bold text-blue-600">{stats.pending}</p></div>
                            <div className="bg-white p-6 rounded-xl shadow-md"><p className="text-sm text-gray-500">In Transit</p><p className="text-3xl font-bold text-yellow-600">{stats.inTransit}</p></div>
                            <div className="bg-white p-6 rounded-xl shadow-md"><p className="text-sm text-gray-500">Earnings Today</p><p className="text-3xl font-bold text-green-600">₹{stats.earningsToday.toFixed(2)}</p></div>
                            <div className="bg-white p-6 rounded-xl shadow-md"><p className="text-sm text-gray-500">Rating</p><p className="text-3xl font-bold text-purple-600">{stats.rating}</p></div>
                        </div>
                        <div>
                           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Active Tasks</h2>
                           <div className="space-y-4">
                                {tasks.length > 0 ? tasks.map(task => (
                                    <div key={task.bookingId} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                                            <div><p className="font-bold text-lg text-purple-700">{task.bookingId}</p><span className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full ${task.status === 'Pending' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{task.status}</span></div>
                                            <button className="mt-2 sm:mt-0 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black flex items-center"><Navigation className="h-4 w-4 mr-2"/> Open in Maps</button>
                                        </div>
                                        <div className="border-t pt-4 grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2"><h4 className="font-semibold text-gray-600">Pickup Locations</h4>{task.pickupLocations.map((loc, i) => <div key={i} className="flex items-start text-gray-700"><MapPin className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-1" /><p>{loc.address}</p></div>)}</div>
                                            <div className="space-y-2"><h4 className="font-semibold text-gray-600">Drop-off Locations</h4>{task.dropLocations.map((loc, i) => <div key={i} className="flex items-start text-gray-700"><MapPin className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-1" /><p>{loc.address}</p></div>)}</div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row justify-between items-center">
                                            <div className="flex items-center text-gray-700 text-sm"><Package className="h-5 w-5 mr-3 text-gray-500" /><p><span className="font-semibold">Items:</span> {task.items.map(i => i.name).join(', ')}</p></div>
                                            <div className="mt-4 sm:mt-0 flex space-x-3">
                                                <button onClick={() => handleStatusUpdate(task.bookingId, 'In Transit')} disabled={isUpdatingTask === task.bookingId || task.status !== 'Pending'} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                                                    {isUpdatingTask === task.bookingId ? <Loader className="h-4 w-4 animate-spin mr-2"/> : <ArrowRight className="h-4 w-4 mr-2"/>} Mark as Picked Up
                                                </button>
                                                <button onClick={() => handleStatusUpdate(task.bookingId, 'Delivered')} disabled={isUpdatingTask === task.bookingId || task.status !== 'In Transit'} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                                                    {isUpdatingTask === task.bookingId ? <Loader className="h-4 w-4 animate-spin mr-2"/> : <CheckCircle className="h-4 w-4 mr-2"/>} Mark as Delivered
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-16 bg-white rounded-xl shadow-md"><Truck className="mx-auto h-12 w-12 text-gray-400"/><h3 className="mt-4 text-lg font-medium text-gray-900">No Active Deliveries</h3><p className="mt-1 text-sm text-gray-500">You're all caught up! Go online to receive new tasks.</p></div>
                                )}
                           </div>
                        </div>
                    </div>
                )}

                {activeTab === 'earnings' && (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Earnings History</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead><tr className="bg-gray-50"><th className="p-3">Booking ID</th><th className="p-3">Date Completed</th><th className="p-3 text-right">Your Earning</th></tr></thead>
                                <tbody>
                                    {history.map(ride => (
                                        <tr key={ride._id} className="border-b"><td className="p-3 font-mono text-purple-600">{ride.bookingId}</td><td className="p-3">{new Date(ride.completionDate).toLocaleDateString('en-IN')}</td><td className="p-3 text-right font-bold text-green-600">₹{ride.driverEarning.toFixed(2)}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                            {history.length === 0 && <p className="text-center text-gray-500 py-8">No completed rides found in your history.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Ride History</h2>
                            {history.length > 0 && <button onClick={handleClearHistory} className="flex items-center text-sm font-semibold text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4 mr-2"/>Clear History</button>}
                        </div>
                        <div className="space-y-4">
                            {history.map(ride => (
                                <div key={ride._id} className="p-4 border rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-purple-700">{ride.bookingId} - <span className={`font-normal text-sm ${ride.status === 'Delivered' ? 'text-green-600' : 'text-red-600'}`}>{ride.status}</span></p>
                                        <p className="text-sm font-semibold text-gray-800">₹{ride.amount.toFixed(2)}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{ride.pickupLocations[0].address} to {ride.dropLocations[0].address}</p>
                                </div>
                            ))}
                        </div>
                        {history.length === 0 && <p className="text-center text-gray-500 py-8">No completed rides found in your history.</p>}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
                         {console.log('User Profile:', user)} {/* Debug user object */}
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                            <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="flex items-center text-sm font-semibold text-purple-600 hover:text-purple-800">
                                <Edit className="h-4 w-4 mr-2" />
                                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                            </button>
                         </div>
                         
                         {isEditingProfile ? (
                            <div>
                                <p className="text-sm text-gray-500 mb-4">Update your profile details below.</p>
                                {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
                                <DriverProfileForm 
                                    initialData={user}
                                    onSubmit={handleProfileUpdate}
                                    isLoading={isUpdatingProfile}
                                    submitButtonText="Update Profile"
                                />
                            </div>
                         ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium text-gray-800">{user.name || 'Not Added'}</p></div>
                                    <div><p className="text-sm text-gray-500">Email</p><p className="font-medium text-gray-800">{user.email || 'Not Added'}</p></div>
                                    <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium text-gray-800">{user.phone || 'Not Added'}</p></div>
                                    <div><p className="text-sm text-gray-500">Gender</p><p className="font-medium text-gray-800">{user.gender || 'Not Added'}</p></div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium text-gray-800">{user.address || 'Not Added'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><p className="text-sm text-gray-500">License Number</p><p className="font-medium text-gray-800">{user.licenseNumber || 'Not Added'}</p></div>
                                    <div><p className="text-sm text-gray-500">Experience</p><p className="font-medium text-gray-800">{user.experience ? `${user.experience} years` : 'Not Added'}</p></div>
                                    <div><p className="text-sm text-gray-500">Vehicle Type</p><p className="font-medium text-gray-800">{user.vehicleType || 'Not Added'}</p></div>
                                    <div><p className="text-sm text-gray-500">Vehicle Number</p><p className="font-medium text-gray-800">{user.vehicleNumber || 'Not Added'}</p></div>
                                </div>
                            </div>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverDashboard;