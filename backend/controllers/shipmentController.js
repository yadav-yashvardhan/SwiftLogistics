// const Shipment = require('../models/Shipment');

// exports.createShipment = async (req, res) => {
//   const { trackingNumber, origin, destination, estimatedDelivery } = req.body;
//   try {
//     const shipment = new Shipment({
//       user: req.user.id, // From auth middleware
//       trackingNumber,
//       origin,
//       destination,
//       estimatedDelivery,
//     });
//     await shipment.save();
//     res.json(shipment);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// exports.getShipments = async (req, res) => {
//   try {
//     const shipments = await Shipment.find({ user: req.user.id });
//     res.json(shipments);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// // More methods like update status, etc.