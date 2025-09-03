const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    address: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
}, {_id: false});

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    weight: { type: String },
    size: { type: String },
    pickupLocationIndex: { type: Number, required: true },
    dropLocationIndex: { type: Number, required: true },
}, {_id: false});

const driverSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    name: { type: String, required: true },
    phone: { type: String },
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
}, {_id: false});

const bookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    status: { type: String, enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'], default: 'Pending' },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    driverEarning: { type: Number, required: true },
    pickupLocations: [locationSchema],
    dropLocations: [locationSchema],
    items: [itemSchema],
    driver: driverSchema,
    completionDate: { type: Date },
    servicePlan: { type: String, default: 'standard' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);