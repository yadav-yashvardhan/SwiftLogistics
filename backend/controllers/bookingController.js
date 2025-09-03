const mongoose = require('mongoose'); // <-- IMPORTANT: Yeh line add ki gayi hai
const Booking = require('../models/bookingModel');
const Driver = require('../models/driverModel');
const User = require('../models/User');

const getRequiredVehicleType = (items) => {
    let maxDimension = 0;
    const getMaxDimension = (sizeString) => {
        if (!sizeString || typeof sizeString !== 'string') return 0;
        const dimensions = sizeString.toLowerCase().split('x').map(Number);
        return Math.max(...dimensions.filter(num => !isNaN(num)));
    };
    if (Array.isArray(items)) {
        for (const item of items) {
            const itemMax = getMaxDimension(item.size);
            if (itemMax > maxDimension) maxDimension = itemMax;
        }
    }
    if (maxDimension >= 10) return 'Large Truck';
    if (maxDimension >= 5) return 'Small Truck';
    return 'Bike';
};

exports.createBooking = async (req, res) => {
    try {
        const { pickupLocations, dropLocations, items, amount, driverInfo, servicePlan } = req.body;

        let driverDetailsForBooking;
        let driverToMakeUnavailable = null;

        if (driverInfo && driverInfo.name) {
            console.log("Frontend provided driver info (Mock Driver Flow). Creating temporary ID.");
            
            // ### YAHAN FINAL FIX KIYA GAYA HAI ###
            // Hum ek dummy ID bana rahe hain taaki database ka "ID is required" wala rule na toote.
            driverDetailsForBooking = {
                _id: new mongoose.Types.ObjectId(), // <-- Temporary ID banaya gaya
                name: driverInfo.name,
                phone: driverInfo.phone,
                vehicleType: driverInfo.vehicleType,
                vehicleNumber: driverInfo.vehicleNumber,
            };

        } else {
            console.log("No driver info from frontend. Searching for an available driver in DB.");
            const requiredVehicle = getRequiredVehicleType(items);
            
            const availableDriver = await Driver.findOne({ 
                isAvailable: true, 
                vehicleType: requiredVehicle,
                profileStatus: 'Complete'
            });

            if (!availableDriver) {
                return res.status(400).json({ msg: `Sorry, no available ${requiredVehicle} drivers found.` });
            }

            driverDetailsForBooking = {
                _id: availableDriver._id,
                name: availableDriver.name,
                phone: availableDriver.phone || 'N/A',
                vehicleType: availableDriver.vehicleType,
                vehicleNumber: availableDriver.vehicleNumber,
            };

            driverToMakeUnavailable = availableDriver;
        }
        
        const driverEarning = amount * 0.10;
        const bookingId = `SWIFT-${Date.now().toString().slice(-6)}`;

        const newBooking = new Booking({
            bookingId,
            pickupLocations,
            dropLocations,
            items,
            amount,
            driverEarning,
            user: req.user.id,
            driver: driverDetailsForBooking,
            servicePlan: servicePlan || 'standard'
        });

        const savedBooking = await newBooking.save();

        if (driverToMakeUnavailable) {
            driverToMakeUnavailable.isAvailable = false;
            await driverToMakeUnavailable.save();
        }

        res.status(201).json({ booking: savedBooking, msg: "Booking created successfully!" });

    } catch (error) {
        // Mongoose validation error check
        if (error.name === 'ValidationError') {
            console.error("Validation Error:", error.message);
            return res.status(400).json({ msg: `Validation Error: ${error.message}` });
        }
        console.error("Error creating booking:", error);
        res.status(500).json({ msg: 'Server error while creating booking.' });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error while fetching bookings.' });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingId: req.params.bookingId })
            .populate('user', 'name');

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found with this ID.' });
        }
        res.json(booking);
    } catch (error)
        {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

