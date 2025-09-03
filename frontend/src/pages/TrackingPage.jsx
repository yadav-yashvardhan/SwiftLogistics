// src/pages/TrackingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, Truck, CheckCircle, Loader } from 'lucide-react';

const TrackingPage = () => {
    const { trackingId: urlTrackingId } = useParams();
    const navigate = useNavigate();

    const [trackingId, setTrackingId] = useState(urlTrackingId || '');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchBookingDetails = async (id) => {
        if (!id) return;
        setIsLoading(true);
        setError('');
        setBookingDetails(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || 'Tracking ID not found.');
            }
            setBookingDetails(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (urlTrackingId) {
            fetchBookingDetails(urlTrackingId);
        }
    }, [urlTrackingId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (trackingId) {
            navigate(`/track/${trackingId}`);
        }
    };
    
    // Status ke hisab se timeline step ka style decide karein
    const getStepStatus = (stepStatus) => {
        const statuses = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered'];
        const currentStatusIndex = statuses.indexOf(bookingDetails?.status);
        const stepIndex = statuses.indexOf(stepStatus);

        if (stepIndex < currentStatusIndex) return 'completed';
        if (stepIndex === currentStatusIndex) return 'current';
        return 'pending';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Track Your Shipment</h1>
                    <p className="text-center text-gray-500 mb-8">Enter your tracking ID to get the latest updates.</p>

                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                            placeholder="Enter your Tracking ID (e.g., SWIFT-123456)"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                        <button type="submit" disabled={isLoading} className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50">
                            {isLoading ? 'Tracking...' : 'Track'}
                        </button>
                    </form>
                </div>

                {error && <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg text-center">{error}</div>}
                
                {isLoading && <div className="mt-6 text-center"><Loader className="h-8 w-8 animate-spin mx-auto text-purple-600"/></div>}

                {bookingDetails && (
                    <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                        <div className="grid md:grid-cols-3 gap-6 text-center border-b pb-6 mb-6">
                            <div><p className="text-sm text-gray-500">Tracking ID</p><p className="font-bold text-purple-700">{bookingDetails.bookingId}</p></div>
                            <div><p className="text-sm text-gray-500">Status</p><p className="font-bold text-yellow-600">{bookingDetails.status}</p></div>
                            <div><p className="text-sm text-gray-500">Booked On</p><p className="font-bold text-gray-700">{new Date(bookingDetails.date).toLocaleDateString('en-IN')}</p></div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-8">
                            {['Pending', 'In Transit', 'Delivered'].map((status, index, arr) => {
                                const stepState = getStepStatus(status);
                                return (
                                <div key={status} className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${stepState === 'completed' ? 'bg-green-500' : stepState === 'current' ? 'bg-purple-600 ring-4 ring-purple-200' : 'bg-gray-300'}`}>
                                            {stepState === 'completed' ? <CheckCircle className="w-6 h-6 text-white" /> : <Package className={`w-6 h-6 ${stepState === 'current' ? 'text-white' : 'text-gray-500'}`} />}
                                        </div>
                                        {index < arr.length - 1 && <div className={`w-0.5 h-full ${stepState === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>}
                                    </div>
                                    <div className={`pt-1 ${stepState === 'pending' ? 'opacity-50' : ''}`}>
                                        <p className="font-bold text-lg text-gray-800">{status === 'Pending' ? 'Booking Confirmed' : status}</p>
                                        <p className="text-sm text-gray-600">
                                            {status === 'Pending' && `Your shipment from ${bookingDetails.from} to ${bookingDetails.to} has been confirmed.`}
                                            {status === 'In Transit' && 'Your package is on its way to the destination.'}
                                            {status === 'Delivered' && 'Your package has been successfully delivered.'}
                                        </p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                )}
            </div>
             {/* Animation Style */}
            <style jsx global>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default TrackingPage;