// const mongoose = require('mongoose');

// const shipmentSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   trackingNumber: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'in-transit', 'delivered', 'delayed'],
//     default: 'pending',
//   },
//   origin: {
//     type: String,
//     required: true,
//   },
//   destination: {
//     type: String,
//     required: true,
//   },
//   estimatedDelivery: Date,
//   actualDelivery: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Shipment', shipmentSchema);