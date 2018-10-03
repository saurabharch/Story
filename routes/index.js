const express = require('express');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const router = express.Router();
const { ensureAuthenticated, ensureGuest} = require('../helpers/auth');


router.get('/', (req, res) => {
    res.locals.metaTags = {
        title: 'StoryBook',
        description: 'StoryBook is an award winning blog that talks about living a boss free life with blogging. We cover about WordPress, SEO, Make money Blogging, Affi. marketing.',
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

router.get('/comments/:storyid', ensureAuthenticated, (req, res) => {
    const obajectid = req.params.storyid;
   hostAddress = req.protocol + '://' + req.get('host') + req.originalUrl;
   Story.findOne({
           _id: mongoose.Types.ObjectId(obajectid)
       })
       .populate('comments')
       .then(story => {
           if (story.status == 'public') {
               res.locals.metaTags = {
                   title: story.title,
                   description: story.description,
                   keywords: story.keywords,
                   generator: 'Story Book MetaTag Generator v.1.0',
                   author: story.user.firstName + " " + story.user.lastName,
                   myTwitter: story.user.twitterId,
                   TwitterLink: '@storybook'

               };
               res.render('index/comments', {
                   story: story.comments,
                   storyTitle: story.title,
                   url: hostAddress,
                   layout: "main"
               });
           } else {
               if (req.user) {
                   if (req.user.id == story.user._id) {

                       res.render('comments', {
                           story: story.comments,
                           user: user
                       });
                   } else {
                       res.redirect('/index');
                   }

               } else {
                   res.redirect('/index');
               }
           }    
           console.log(story.comments);
       });

});


router.get('/about', ensureGuest,(req, res) => {
    res.render('index/about');
});
router.get('/security', ensureGuest,(req, res) => {
    res.render('index/security');
});
router.get('/donate', ensureGuest, (req, res) => {
    res.render('index/donate');
});
// router.get('/popular', ensureGuest, (req, res) => {
//     res.render('index/popular');
// });
module.exports = router;