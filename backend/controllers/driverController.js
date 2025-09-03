const Booking = require('../models/bookingModel');
const Driver = require('../models/driverModel');
const mongoose = require('mongoose');
const { getRequiredVehicleType } = require('../utils/vehicleUtils');

// @desc    Find an available driver for a new shipment
exports.findAvailableDriver = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ msg: 'Item list is required.' });
        }
        const requiredVehicle = getRequiredVehicleType(items);
        const driver = await Driver.findOne({
            isAvailable: true,
            vehicleType: requiredVehicle,
            profileStatus: 'Complete'
        });
        if (!driver) {
            return res.status(404).json({ msg: `No available ${requiredVehicle} drivers found.` });
        }
        res.json({
            driver: {
                name: driver.name,
                phone: driver.phone,
                vehicleType: driver.vehicleType,
                vehicleNumber: driver.vehicleNumber,
                vehicleImage: `https://placehold.co/150x150/E9D5FF/7C3AED/png?text=${driver.vehicleType.replace(' ', '+')}`
            }
        });
    } catch (error) {
        console.error("Error finding available driver:", error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Update driver's own profile
// @route   PUT /api/driver/profile
// @access  Private (Driver only)
exports.updateDriverProfile = async (req, res) => {
    try {
        const { name, address, licenseNumber, vehicleType, vehicleNumber, phone, gender, experience } = req.body;

        const driver = await Driver.findById(req.user.id);
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }

        // Update all details
        driver.name = name || driver.name;
        driver.address = address || driver.address;
        driver.licenseNumber = licenseNumber || driver.licenseNumber;
        driver.vehicleType = vehicleType || driver.vehicleType;
        driver.vehicleNumber = vehicleNumber || driver.vehicleNumber;
        driver.phone = phone || driver.phone;
        driver.gender = gender || driver.gender;
        driver.experience = experience || driver.experience;
        driver.profileStatus = 'Complete';

        const updatedDriver = await driver.save();
        
        // BADLAV: Frontend ko poora updated user object bhejein
        res.json({
            name: updatedDriver.name,
            email: updatedDriver.email,
            role: updatedDriver.role,
            profileStatus: updatedDriver.profileStatus,
            address: updatedDriver.address,
            licenseNumber: updatedDriver.licenseNumber,
            vehicleType: updatedDriver.vehicleType,
            vehicleNumber: updatedDriver.vehicleNumber,
            phone: updatedDriver.phone,
            gender: updatedDriver.gender,
            experience: updatedDriver.experience
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// --- Other functions below have no changes ---

// @desc    Get all assigned and active bookings for a driver
exports.getAssignedTasks = async (req, res) => {
    try {
        const tasks = await Booking.find({ 
            'driver._id': req.user.id,
            status: { $in: ['Pending', 'In Transit'] }
        }).sort({ date: 1 });
        res.json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Update the status of a booking
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['In Transit', 'Delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid status update' });
        }
        const booking = await Booking.findOneAndUpdate(
            { bookingId: req.params.bookingId, 'driver._id': req.user.id },
            { $set: { 
                status: status,
                ...(status === 'Delivered' && { completionDate: new Date() }) 
              } 
            },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found or not assigned to you' });
        }
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Update driver's availability status
exports.updateAvailability = async (req, res) => {
    try {
        const { isAvailable } = req.body;
        const driver = await Driver.findById(req.user.id);
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }
        driver.isAvailable = isAvailable;
        await driver.save();
        res.json({ isAvailable: driver.isAvailable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc    Get statistics for the logged-in driver
exports.getDriverStats = async (req, res) => {
    try {
        const driverId = req.user.id;
        const activeTasks = await Booking.find({ 
            'driver._id': driverId,
            status: { $in: ['Pending', 'In Transit'] }
        });
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const earningsAggregation = await Booking.aggregate([
            {
                $match: {
                    'driver._id': new mongoose.Types.ObjectId(driverId),
                    status: 'Delivered',
                    completionDate: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: '$driverEarning' }
                }
            }
        ]);
        const earningsToday = earningsAggregation.length > 0 ? earningsAggregation[0].totalEarnings : 0;
        const driver = await Driver.findById(driverId);
        let averageRating = 5;
        if (driver.ratings && driver.ratings.length > 0) {
            const totalRating = driver.ratings.reduce((sum, r) => sum + r.rating, 0);
            averageRating = (totalRating / driver.ratings.length).toFixed(1);
        }
        res.json({
            stats: {
                pending: activeTasks.filter(t => t.status === 'Pending').length,
                inTransit: activeTasks.filter(t => t.status === 'In Transit').length,
                earningsToday: earningsToday,
                rating: parseFloat(averageRating)
            }
        });
    } catch (error) {
        console.error("Error fetching driver stats:", error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc Get Ride History
exports.getRideHistory = async (req, res) => {
    try {
        const rides = await Booking.find({ 
            'driver._id': req.user.id,
            status: { $in: ['Delivered', 'Cancelled'] }
        }).sort({ completionDate: -1 });
        res.json({ rides });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc Delete Ride History
exports.deleteRideHistory = async (req, res) => {
    try {
        await Booking.deleteMany({
            'driver._id': req.user.id,
            status: { $in: ['Delivered', 'Cancelled'] }
        });
        res.json({ msg: 'Ride history cleared successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};