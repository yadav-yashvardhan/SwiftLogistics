const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'driver' },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  profileStatus: {
    type: String,
    enum: ['Pending', 'Complete'],
    default: 'Pending',
  },
  // NAYI FIELDS
  phone: { 
    type: String 
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  experience: {
    type: Number, // Years of experience
  },
  // Purani Fields
  vehicleType: {
    type: String,
    enum: ['Bike', 'Small Truck', 'Large Truck'],
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  licenseNumber: {
    type: String,
  },
  ratings: [{
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true }); // Timestamps add createdAt and updatedAt fields automatically

driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

driverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Driver', driverSchema);