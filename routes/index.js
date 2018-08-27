const express = require('express');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const router = express.Router();

const { ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
    res.locals.metaTags = {
        title: 'StoryBook',
        description: 'StoryBook is an award winning blog that talks about living a boss free life with blogging. We cover about WordPress, SEO, Make money Blogging, Affiliate marketing.',
        keywords: 'Affiliate Marketing,Money Making, Online Earning, Blog, Science and Technology,Software and web application development',
        generator: 'Story Book MetaTag Generator v.1.0',
        author: 'Saurabh Kashyap'
    };
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