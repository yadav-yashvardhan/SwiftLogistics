const express = require('express');
const router = express.Router();
const { 
    getAssignedTasks, updateTaskStatus, updateAvailability, 
    getDriverStats, updateDriverProfile, findAvailableDriver,
    getRideHistory, deleteRideHistory // Naye functions import karein
} = require('../controllers/driverController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/find-available', findAvailableDriver);

router.use(authMiddleware);

// NAYE ROUTES
router.get('/history', getRideHistory);
router.delete('/history', deleteRideHistory);

// Purane routes
router.get('/stats', getDriverStats);
router.get('/tasks', getAssignedTasks);
router.put('/tasks/:bookingId/status', updateTaskStatus);
router.put('/availability', updateAvailability);
router.put('/profile', updateDriverProfile);

module.exports = router;