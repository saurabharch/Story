const express = require('express');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const router = express.Router();

const { ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Story.find({ user: req.user.id })
        .then(stories => {
            res.render('index/dashboard', {
                stories: stories
            });
        });
});

router.get('/about', ensureGuest,(req, res) => {
    res.render('index/about');
});
router.get('/security', ensureGuest,(req, res) => {
    res.render('index/security');
});
module.exports = router;