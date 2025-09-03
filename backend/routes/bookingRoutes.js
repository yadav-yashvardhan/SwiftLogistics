// routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingById } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Get a single booking by its public ID (e.g., /api/bookings/SWIFT-12345)
// This route is public, so it does not have authMiddleware.
router.get('/:bookingId', getBookingById);

// Get all bookings for the logged-in user (e.g., /api/bookings)
// This route IS protected.
router.get('/', authMiddleware, getMyBookings);

// Create a new booking
// This route IS also protected.
router.post('/', authMiddleware, createBooking);


module.exports = router;