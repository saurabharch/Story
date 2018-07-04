const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        res.redirect('/dashboard');
    });
    
router.get('/facebook', passport.authenticate('facebook', { scope: ['user_friends', 'manage_pages']}));

router.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/dashboard', failureRedirect: '/'}));

router.get('/verify', (req, res) => {
    if (req.user) {
        console.log(req.user);
    } else {
        console.log('Not Auth');
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
