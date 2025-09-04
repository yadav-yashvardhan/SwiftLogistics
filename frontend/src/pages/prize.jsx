import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calculator, MapPin, Package, Truck, Tag, Percent,
    Gift, Star, Zap, Shield, Clock, ChevronRight,
    Check, X, Sparkles, TrendingUp, Award, UserCheck, Phone, Loader
} from 'lucide-react';

// Mock driver data to be used as a fallback
const mockDriver = {
    name: "Ramesh Kumar",
    phone: "9876543210",
    vehicleType: "Tata Ace",
    vehicleNumber: "DL 1A 1234",
    vehicleImage: "https://i.imgur.com/8f22WzD.png",
    isMock: true
};

const PricingPage = ({ pickupLocations, dropLocations, items, onBack }) => {
    const navigate = useNavigate();
    
    // State for the real driver fetched from the backend
    const [assignedDriver, setAssignedDriver] = useState(null);
    const [isLoadingDriver, setIsLoadingDriver] = useState(true);
    const [driverError, setDriverError] = useState('');

    // Other component states
    const [distances, setDistances] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [showCouponSuccess, setShowCouponSuccess] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('standard');

    // Fetch the best available driver from the backend when the page loads
    useEffect(() => {
        const fetchAssignedDriver = async () => {
            if (!items || items.length === 0) {
                setIsLoadingDriver(false);
                setDriverError('No items to ship.');
                return;
            }
            try {
                setIsLoadingDriver(true);
                setDriverError('');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/find-available`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.msg || 'Could not find a driver.');
                }
                setAssignedDriver(data.driver);
            } catch (err) {
                console.warn("Could not fetch real driver, using mock data:", err.message);
                setDriverError('');
                setAssignedDriver(mockDriver);
            } finally {
                setIsLoadingDriver(false);
            }
        };

        fetchAssignedDriver();
    }, [items]);

    // All pricing calculation logic
    const availableCoupons = [
        { code: 'FIRST50', discount: 50, type: 'flat', description: '₹50 off on your first order' },
        { code: 'SAVE20', discount: 20, type: 'percentage', description: '20% off on total amount' },
        { code: 'BULK100', discount: 100, type: 'flat', description: '₹100 off on orders above ₹2000' },
        { code: 'EXPRESS15', discount: 15, type: 'percentage', description: '15% off on express delivery' }
    ];
    const servicePlans = {
        standard: { name: 'Standard', multiplier: 1, features: ['24-48 hours delivery', 'Basic tracking', 'Email support'] },
        express: { name: 'Express', multiplier: 1.5, features: ['Same day delivery', 'Real-time tracking', 'Priority support', 'SMS updates'] },
        premium: { name: 'Premium', multiplier: 2, features: ['2-hour delivery', 'Live tracking', '24/7 support', 'White glove service', 'Insurance included'] }
    };
    useEffect(() => {
        const calculateDistances = () => {
            const distanceData = [];
            pickupLocations.forEach(pickup => {
                dropLocations.forEach(drop => {
                    const mockDistance = Math.random() * 20 + 1;
                    distanceData.push({
                        pickupId: pickup.id,
                        dropId: drop.id,
                        distance: mockDistance,
                        pickupAddress: pickup.address,
                        dropAddress: drop.address
                    });
                });
            });
            setDistances(distanceData);
        };
        if (pickupLocations && dropLocations) {
            calculateDistances();
        }
    }, [pickupLocations, dropLocations]);
    const calculateBasePrice = (distance) => {
        if (distance <= 5) return 500;
        if (distance <= 10) return 800;
        return 1000;
    };
    const calculateItemPricing = () => {
        return items.map(item => {
            const route = distances.find(d => d.pickupId === item.pickupLocationId && d.dropId === item.dropLocationId);
            if (!route) return null;
            const basePrice = calculateBasePrice(route.distance);
            const weightCharge = item.weight ? parseFloat(item.weight) * 10 : 0;
            const itemPrice = basePrice + weightCharge;
            return { ...item, distance: route.distance, basePrice, weightCharge, itemPrice, route };
        }).filter(Boolean);
    };
    const itemPricing = calculateItemPricing();
    const subtotal = itemPricing.reduce((sum, item) => sum + item.itemPrice, 0);
    const planMultiplier = servicePlans[selectedPlan].multiplier;
    const planAdjustedTotal = subtotal * planMultiplier;
    const applyCoupon = () => {
        const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
        if (coupon) {
            if (coupon.code === 'BULK100' && planAdjustedTotal < 2000) {
                alert('This coupon requires a minimum order of ₹2000');
                return;
            }
            setAppliedCoupon(coupon);
            setShowCouponSuccess(true);
            setTimeout(() => setShowCouponSuccess(false), 3000);
        }
    };
    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        if (appliedCoupon.type === 'flat') {
            return appliedCoupon.discount;
        } else {
            return (planAdjustedTotal * appliedCoupon.discount) / 100;
        }
    };
    const discount = calculateDiscount();
    const finalTotal = planAdjustedTotal - discount;

    // Razorpay script loader
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    const handlePayment = async () => {
        const saveBookingToDB = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please log in to proceed with the booking.");
                navigate('/login');
                return null;
            }
            
            const processedItems = items.map(item => {
                const pickupIndex = pickupLocations.findIndex(loc => loc.id === item.pickupLocationId);
                const dropIndex = dropLocations.findIndex(loc => loc.id === item.dropLocationId);
                return {
                    name: item.name,
                    weight: item.weight,
                    size: item.size,
                    pickupLocationIndex: pickupIndex,
                    dropLocationIndex: dropIndex,
                };
            });

            const bookingData = {
                pickupLocations: pickupLocations.map(({ id, ...rest }) => rest),
                dropLocations: dropLocations.map(({ id, ...rest }) => rest),
                items: processedItems,
                amount: finalTotal,
                servicePlan: selectedPlan
            };

            if (assignedDriver?.isMock) {
                bookingData.driverInfo = {
                    name: assignedDriver.name,
                    phone: assignedDriver.phone,
                    vehicleType: assignedDriver.vehicleType,
                    vehicleNumber: assignedDriver.vehicleNumber
                };
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(bookingData)
                });
                const data = await response.json();
                if (!response.ok) {
                    if (response.status === 401) {
                        alert("Session expired. Please log in again.");
                        localStorage.removeItem('token');
                        navigate('/login');
                        return null;
                    }
                    throw new Error(data.msg || 'Server error while creating booking');
                }
                return data.booking;
            } catch (error) {
                console.error('Error saving booking:', error);
                alert(`Error: ${error.message}`);
                return null;
            }
        };

        const options = {
            key: 'rzp_test_Xgn4ze9r2JyFLk',
            amount: Math.round(finalTotal * 100),
            currency: 'INR',
            name: 'SwiftLogistics',
            description: `Payment for ${items.length} item(s)`,
            handler: async function (response) {
                const newBooking = await saveBookingToDB();
                if (newBooking) {
                    navigate('/booking-confirmation', { state: { booking: newBooking } });
                }
            },
            prefill: {
                name: pickupLocations[0]?.name || 'Customer Name',
                email: 'customer@example.com',
                contact: pickupLocations[0]?.phone || '9999999999',
            },
            notes: { address: pickupLocations[0]?.address || 'Customer Address', plan: selectedPlan },
            theme: { color: '#7C3AED' },
        };

        if (window.Razorpay) {
            new window.Razorpay(options).open();
        } else {
            alert("Payment gateway failed to load.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto w-full">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center"><Calculator className="mr-2 h-6 w-6 sm:h-8 sm:w-8" />Pricing & Checkout</h1>
                    <p className="mt-1 sm:mt-2 text-purple-200 text-sm sm:text-base">Transparent pricing with amazing offers!</p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center"><Package className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />Item-wise Pricing Breakdown</h2>
                            <div className="space-y-3 sm:space-y-4">
                                {itemPricing.map((item, index) => (
                                    <div key={item.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 sm:p-4">
                                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                                                    {item.image && (
                                                        <img src={item.image} alt={item.name} className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded mr-2 sm:mr-3" />
                                                    )}
                                                    {item.name || `Item ${index + 1}`}
                                                </h4>
                                                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 space-y-1">
                                                    <p className="flex items-center">
                                                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-purple-600" /> Distance: {item.distance.toFixed(1)} km
                                                    </p>
                                                    {item.weight && (
                                                        <p className="flex items-center">
                                                            <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-600" /> Weight: {item.weight} kg
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs sm:text-sm text-gray-600">
                                                    <p>Base: ₹{item.basePrice}</p>
                                                    {item.weightCharge > 0 && <p>Weight: +₹{item.weightCharge}</p>}
                                                </div>
                                                <p className="text-base sm:text-xl font-bold text-purple-600 mt-1">₹{item.itemPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-xl p-4 sm:p-6 text-white">
                            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center"><Gift className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />Limited Time Offers!</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {availableCoupons.map((coupon, idx) => (
                                    <div key={idx} className="bg-white/20 backdrop-blur rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-sm sm:text-base">{coupon.code}</p>
                                                <p className="text-xs sm:text-sm opacity-90">{coupon.description}</p>
                                            </div>
                                            <button
                                                onClick={() => { setCouponCode(coupon.code); applyCoupon(); }}
                                                className="bg-white text-orange-500 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold hover:bg-orange-50 transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center"><Zap className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />Choose Your Service Plan</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                {Object.entries(servicePlans).map(([key, plan]) => (
                                    <div
                                        key={key}
                                        onClick={() => setSelectedPlan(key)}
                                        className={`relative cursor-pointer rounded-xl p-4 sm:p-6 transition-all transform hover:scale-105 ${
                                            selectedPlan === key ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl' : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    >
                                        {key === 'express' && (
                                            <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-red-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full">Popular</div>
                                        )}
                                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{plan.name}</h3>
                                        <p className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 ${selectedPlan === key ? 'text-white' : 'text-purple-600'}`}>
                                            {plan.multiplier}x
                                        </p>
                                        <ul className="space-y-1 sm:space-y-2">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start text-xs sm:text-sm">
                                                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 mt-0.5" /> {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center">
                                <UserCheck className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-blue-600" /> Your Pickup Agent
                            </h2>
                            {isLoadingDriver ? (
                                <div className="flex justify-center items-center h-20 sm:h-24"><Loader className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-purple-500" /></div>
                            ) : driverError ? (
                                <div className="text-center text-red-500 bg-red-50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">{driverError}</div>
                            ) : assignedDriver ? (
                                <>
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <img
                                            src={assignedDriver.vehicleImage}
                                            alt={assignedDriver.vehicleType}
                                            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-4 border-blue-200"
                                        />
                                        <div>
                                            <p className="text-base sm:text-lg font-bold text-gray-800">{assignedDriver.name}</p>
                                            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <Shield className="h-3 w-3 mr-1" /> Verified Driver
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 sm:mt-4 space-y-2 text-gray-700">
                                        <div className="flex items-center">
                                            <Truck className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500" />
                                            <div>
                                                <p className="font-semibold text-sm sm:text-base">{assignedDriver.vehicleType}</p>
                                                <p className="text-xs sm:text-sm text-gray-500">{assignedDriver.vehicleNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500" />
                                            <p className="font-semibold text-sm sm:text-base">{assignedDriver.phone}</p>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 sticky top-4 sm:top-6">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center"><TrendingUp className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-green-600" />Order Summary</h2>
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Have a coupon code?</label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {showCouponSuccess && (
                                    <div className="mt-2 text-green-600 text-xs sm:text-sm flex items-center animate-pulse">
                                        <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Coupon applied successfully!
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3 border-t pt-3 sm:pt-4">
                                <div className="flex justify-between text-gray-600 text-sm sm:text-base"><span>Subtotal ({items.length} items)</span><span>₹{subtotal.toFixed(2)}</span></div>
                                {selectedPlan !== 'standard' && (
                                    <div className="flex justify-between text-gray-600 text-sm sm:text-base"><span>{servicePlans[selectedPlan].name} Plan</span><span>+₹{(planAdjustedTotal - subtotal).toFixed(2)}</span></div>
                                )}
                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600 font-semibold text-sm sm:text-base"><span className="flex items-center"><Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />{appliedCoupon.code}</span><span>-₹{discount.toFixed(2)}</span></div>
                                )}
                                <div className="border-t pt-2 sm:pt-3 flex justify-between text-base sm:text-xl font-bold"><span>Total Amount</span><span className="text-purple-600">₹{finalTotal.toFixed(2)}</span></div>
                            </div>
                            <div className="mt-4 sm:mt-6 space-y-2 text-xs sm:text-sm text-gray-600">
                                <div className="flex items-center"><Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600" />100% Secure Payment</div>
                                <div className="flex items-center"><Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-600" />On-time Delivery Guarantee</div>
                                <div className="flex items-center"><Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-yellow-500" />Rated 4.9/5 by 10,000+ customers</div>
                            </div>
                            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                                <button
                                    onClick={handlePayment}
                                    disabled={!assignedDriver || isLoadingDriver}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    Proceed to Payment
                                </button>
                                <button
                                    onClick={onBack}
                                    className="w-full border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                >
                                    Back to Edit
                                </button>
                            </div>
                            <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
                                <div className="text-center"><Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto" /><p className="text-xs text-gray-600 mt-1">Best Service</p></div>
                                <div className="text-center"><Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto" /><p className="text-xs text-gray-600 mt-1">Secure</p></div>
                                <div className="text-center"><Truck className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto" /><p className="text-xs text-gray-600 mt-1">Fast Delivery</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 sm:mt-6 lg:mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center"><MapPin className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />Distance-based Pricing Structure</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        <div className="bg-white rounded-xl p-3 sm:p-4 text-center transform hover:scale-105 transition-transform"><div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">₹500</div><p className="text-sm sm:text-base text-gray-700 font-semibold">0-5 km</p><p className="text-xs sm:text-sm text-gray-600 mt-1">Local deliveries</p></div>
                        <div className="bg-white rounded-xl p-3 sm:p-4 text-center transform hover:scale-105 transition-transform"><div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">₹800</div><p className="text-sm sm:text-base text-gray-700 font-semibold">5-10 km</p><p className="text-xs sm:text-sm text-gray-600 mt-1">City-wide delivery</p></div>
                        <div className="bg-white rounded-xl p-3 sm:p-4 text-center transform hover:scale-105 transition-transform"><div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-1 sm:mb-2">₹1000</div><p className="text-xs sm:text-sm text-gray-600 mt-1">Long distance</p></div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 text-center">* Additional charges apply for weight over 5kg (₹10/kg)</p>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
