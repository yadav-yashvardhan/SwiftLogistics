import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, MapPin, Calendar, IndianRupee, FileText, PlusCircle, AlertCircle, User, ArrowUpCircle, ArrowDownCircle, Package, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getStatusBadge = (status) => {
    switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'In Transit': return 'bg-yellow-100 text-yellow-800';
        case 'Pending': return 'bg-blue-100 text-blue-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const BookingsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedBookingId, setExpandedBookingId] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
                    headers: { 'x-auth-token': token },
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.msg || 'Failed to fetch bookings');
                setBookings(data.bookings);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, [navigate]);

    const handleToggleDetails = (bookingId) => {
        setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
    };

    const filteredBookings = bookings.filter(booking => filter === 'All' || booking.status === filter);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 w-full">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">My Bookings</h1>
                    <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600">Welcome back, {user?.name || 'Guest'}! Here are your shipment details.</p>
                </div>

                <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 border-b border-gray-200">
                    {['All', 'Pending', 'In Transit', 'Delivered'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setFilter(tab)} 
                            className={`px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-colors ${filter === tab ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50' : 'text-gray-500 hover:text-purple-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="space-y-3 sm:space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 sm:py-16"><Loader className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 animate-spin mx-auto" /><p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading your bookings...</p></div>
                    ) : error ? (
                        <div className="text-center py-12 sm:py-16 bg-red-50 rounded-xl"><AlertCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500" /><h3 className="mt-2 text-lg sm:text-xl font-medium text-red-800">Error</h3><p className="mt-1 text-sm sm:text-base text-red-700">{error}</p></div>
                    ) : filteredBookings.length > 0 ? (
                        filteredBookings.map(booking => {
                            const isExpanded = expandedBookingId === booking.bookingId;
                            return (
                                <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                                    <div className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleToggleDetails(booking.bookingId)}>
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                                <p className="font-bold text-purple-700 text-sm sm:text-base">{booking.bookingId}</p>
                                                <p className="text-xs sm:text-sm text-gray-600 hidden sm:flex sm:items-center"><Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-gray-400" />{new Date(booking.date).toLocaleDateString('en-IN')}</p>
                                            </div>
                                            <div className="flex items-center space-x-3 sm:space-x-4 mt-2 sm:mt-0">
                                                <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}>{booking.status}</span>
                                                <div className="text-xs sm:text-sm font-semibold text-purple-600 flex items-center">
                                                    View Details {isExpanded ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 ml-1" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50/50">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                                <div className="space-y-3 sm:space-y-4">
                                                    <h4 className="font-bold text-base sm:text-lg text-gray-800">Itinerary</h4>
                                                    {booking.pickupLocations?.map((loc, index) => (
                                                        <div key={index} className="border-l-4 border-purple-500 pl-3 sm:pl-4 py-2">
                                                            <div className="flex items-center text-purple-700 font-semibold text-sm sm:text-base"><ArrowUpCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />Pickup Location {index + 1}</div>
                                                            <p className="text-xs sm:text-sm text-gray-700 mt-1">{loc.address}</p>
                                                            <p className="text-xs text-gray-500">{loc.name}, {loc.phone}</p>
                                                            <div className="mt-1 sm:mt-2">
                                                                <p className="text-xs font-bold text-gray-600">Items Picked Up:</p>
                                                                <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600">
                                                                    {booking.items?.filter(item => item.pickupLocationIndex === index).map((item, i) => <li key={i}>{item.name}</li>)}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {booking.dropLocations?.map((loc, index) => (
                                                        <div key={index} className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2">
                                                            <div className="flex items-center text-green-700 font-semibold text-sm sm:text-base"><ArrowDownCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />Drop Location {index + 1}</div>
                                                            <p className="text-xs sm:text-sm text-gray-700 mt-1">{loc.address}</p>
                                                            <p className="text-xs text-gray-500">{loc.name}, {loc.phone}</p>
                                                            <div className="mt-1 sm:mt-2">
                                                                <p className="text-xs font-bold text-gray-600">Items Dropped Off:</p>
                                                                <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600">
                                                                    {booking.items?.filter(item => item.dropLocationIndex === index).map((item, i) => <li key={i}>{item.name}</li>)}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="space-y-3 sm:space-y-4 bg-white p-3 sm:p-4 rounded-lg border">
                                                    <h4 className="font-bold text-base sm:text-lg text-gray-800">Shipment & Driver Details</h4>
                                                    <div className="border-b pb-3 sm:pb-4">
                                                        <div className="flex items-center font-semibold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base"><User className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-purple-600" />Pickup Agent</div>
                                                        <p className="text-xs sm:text-sm">Name: <span className="font-medium">{booking.driver?.name || 'N/A'}</span></p>
                                                        <p className="text-xs sm:text-sm">Phone: <span className="font-medium">{booking.driver?.phone || 'N/A'}</span></p>
                                                        <p className="text-xs sm:text-sm">Vehicle: <span className="font-medium">{booking.driver?.vehicleType || 'N/A'} ({booking.driver?.vehicleNumber || 'N/A'})</span></p>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center font-semibold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base"><IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-green-600" />Total Amount</div>
                                                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">₹{booking.amount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-md">
                            <Truck className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg sm:text-xl font-medium text-gray-900">No Bookings Found</h3>
                            <p className="mt-1 text-sm sm:text-base text-gray-500">You haven't made any bookings yet.</p>
                            <div className="mt-4 sm:mt-6">
                                <Link 
                                    to="/schedule-pickup" 
                                    className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                                >
                                    <PlusCircle className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    Create a New Booking
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingsPage;
