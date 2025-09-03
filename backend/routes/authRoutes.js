const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

// Local Auth
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);

// NAYE ROUTES: Driver Auth Routes
router.post('/driver/signup', authController.driverSignup);
router.post('/driver/login', authController.driverLogin);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google OAuth Callback
router.get(
    '/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: false }), 
    authController.googleCallback
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));

// Facebook OAuth Callback
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
    authController.facebookCallback
);

module.exports = router;