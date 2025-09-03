const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS config yahan add karo
app.use(cors({
  origin: process.env.FRONTEND_URL,  // frontend ka Render URL from .env
  credentials: true
}));

// ✅ JSON parse
app.use(express.json());

// Passport Middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/driver', require('./routes/driverRoutes')); // YEH LINE ZAROORI HAI

// Is line ko comment hi rehne dein jab tak aap 'shipmentRoutes.js' nahi banate
// app.use('/api/shipments', require('./routes/shipmentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
