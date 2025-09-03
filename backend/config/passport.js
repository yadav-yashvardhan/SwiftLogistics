const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

module.exports = function(passport) {
    // Passport setup for Google
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                return done(null, user);
            }
            // Social login se naya user banate waqt, ek random strong password daal dein
            const randomPassword = crypto.randomBytes(20).toString('hex');
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: randomPassword // User ko is password ki zaroorat nahi padegi
            });
            await user.save();
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }));

    // Passport setup for Facebook
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'emails']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                return done(null, user);
            }
            const randomPassword = crypto.randomBytes(20).toString('hex');
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: randomPassword
            });
            await user.save();
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }));
}