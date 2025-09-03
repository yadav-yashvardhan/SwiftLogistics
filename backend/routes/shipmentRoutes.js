const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, shipmentController.createShipment);
router.get('/', authMiddleware, shipmentController.getShipments);

module.exports = router;