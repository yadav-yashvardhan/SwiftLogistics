const User = require('../models/User');
const Driver = require('../models/driverModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Signup (User)
exports.signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ 
        token, 
        user: { name: user.name, email: user.email, role: 'user' } 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login (User)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
        token,
        user: { name: user.name, email: user.email, role: 'user' }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Driver Signup
exports.driverSignup = async (req, res) => {
    const { name, email, password, vehicleType, vehicleNumber } = req.body;
    try {
        let driver = await Driver.findOne({ email });
        if (driver) return res.status(400).json({ msg: 'Driver with this email already exists' });

        driver = new Driver({ name, email, password, vehicleType, vehicleNumber });
        await driver.save();

        const token = jwt.sign({ id: driver._id, role: 'driver' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ 
            token, 
            user: { 
                name: driver.name, 
                email: driver.email, 
                role: 'driver', 
                profileStatus: driver.profileStatus 
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Driver Login
exports.driverLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const driver = await Driver.findOne({ email });
        if (!driver) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await driver.matchPassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: driver._id, role: 'driver' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ 
            token,
            user: { 
                name: driver.name, 
                email: driver.email, 
                role: 'driver',
                profileStatus: driver.profileStatus
            }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // TODO: Send email with resetToken (use nodemailer in production)
    res.json({ msg: 'Reset token sent to email', token: resetToken });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Google callback
exports.googleCallback = (req, res, next) => {
    // This requires passport to be configured
    // For now, this is a placeholder
    res.redirect('/');
};

// Facebook callback
exports.facebookCallback = (req, res, next) => {
    // This requires passport to be configured
    // For now, this is a placeholder
    res.redirect('/');
};