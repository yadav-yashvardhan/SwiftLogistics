import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Truck, User, MapPin } from 'lucide-react';

const BookingConfirmation = () => {
    const location = useLocation();
    const { booking } = location.state || {};

    if (!booking) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">No booking details found.</h1>
                <Link to="/" className="text-purple-600 hover:underline">Go to Homepage</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-pulse" />
                <h1 className="text-4xl font-extrabold text-gray-800 mt-4">Booking Confirmed!</h1>
                <p className="text-gray-600 mt-2">Your shipment is scheduled. A driver has been assigned.</p>

                <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border">
                    <p className="text-lg font-bold text-purple-700 mb-4">
                        Booking ID: {booking.bookingId}
                    </p>
                    <div className="space-y-4">
                        <div className="pb-4 border-b">
                            <h3 className="font-semibold text-gray-700 mb-2">Assigned Driver</h3>
                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-gray-500" />
                                <span>{booking.driver.name}</span>
                            </div>
                            <div className="flex items-center space-x-3 mt-2">
                                <Truck className="h-5 w-5 text-gray-500" />
                                <span>{booking.driver.vehicleType} ({booking.driver.vehicleNumber})</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Itinerary</h3>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-red-500 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500">FROM</p>
                                    <p>{booking.pickupLocations[0].address}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 mt-3">
                                <MapPin className="h-5 w-5 text-green-500 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500">TO</p>
                                    <p>{booking.dropLocations[0].address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to={`/track/${booking.bookingId}`} className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                        Track Your Booking
                    </Link>
                    <Link to="/bookings" className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                        View All Bookings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;