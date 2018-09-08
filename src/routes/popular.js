const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
// const Category = mongoose.model('categories');
const User = mongoose.model('users');
const keys = require('../config/keys');
const {
    ensureAuthenticated,
    ensureGuest
} = require('../helpers/auth');
// const conn = mongoose.createConnection(keys.mongoURI);
//Story Index

likescount = [];
dislikecount = [];
ratedusers = [];

router.get('/', (req, res) => {
   // console.log(parseInt(req.query.page));
    var pages = parseInt(req.query.page) || 1;
    var size = parseInt(req.query.size) || 3;
    var popular = {
        status: 'public'
    };
    var sendres;
    console.log(pages);
    if (pages < 0 || pages === 0) {
        popular = {
            "error": true,
            "message": "invalid page number, should start with 1"
        };
        return res.json(popular);
    }
    popular.skip = size * (pages - 1);
    popular.limit = size;
    popular.populate = 'user';
    popular.sort = {
        views: -1,
        date: -1
    };
    Story.count({
        status: 'public'
    }, function (err, totalC) {
        if (err) {
            popularpost = {
                "error": true,
                "message": "Error fetching data"
            }
        }
        Story.find({}, {}, popular, function (err, popularpost, response) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = {
                    "error": true,
                    "popularpost": "Error fetching data"
                };
            } else {
                var totalP = Math.ceil(totalC / size);
                response = {
                    "error": false,
                    "popular": popularpost,
                    "pages": totalP
                };

            }
            res.locals.metaTags = {
                title: 'StoryBook',
                description: 'StoryBook is an award winning blog that talks about living a boss free life with blogging. We cover about WordPress, SEO, Make money Blogging, Affiliate marketing.',
                keywords: 'Affiliate Marketing,Money Making, Online Earning, Blog, Science and Technology,Software and web application development',
                generator: 'Story Book MetaTag Generator v.1.0',
                author: 'Saurabh Kashyap'
            };
            res.render('popular/index', {
                // stories: response.message,
                // pages: totalPages,
                // total: totalCount,
                // page: page
                popular: response.popular,
                pageno: pages
            });
            // return  res.send(JSON.stringify(response));
            // sendres = JSON.stringify(popularpost);

        });
    });
});
router.get('/:page', (req, res) => {
   // console.log(parseInt(req.params.page));
    var pages = parseInt(req.params.page) || 1;
    var size = parseInt(req.query.size) || 3;
    var popular = {
        status: 'public'
    };
    var sendres;
    console.log(pages);
    if (pages < 0 || pages === 0) {
        popular = {
            "error": true,
            "message": "invalid page number, should start with 1"
        };
        return res.json(popular);
    }
    popular.skip = size * (pages - 1);
    popular.limit = size;
    popular.populate = 'user';
    popular.sort = {
        views: -1,
        date: -1
    };
    Story.count({
        status: 'public'
    }, function (err, totalC) {
        if (err) {
            popularpost = {
                "error": true,
                "message": "Error fetching data"
            }
        }
        Story.find({}, {}, popular, function (err, popularpost, response) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = {
                    "error": true,
                    "popularpost": "Error fetching data"
                };
            } else {
                var totalP = Math.ceil(totalC / size);
                response = {
                    "error": false,
                    "popular": popularpost,
                    "pages": totalP
                };
               
            }
            res.locals.metaTags = {
                title: 'StoryBook',
                description: 'StoryBook is an award winning blog that talks about living a boss free life with blogging. We cover about WordPress, SEO, Make money Blogging, Affiliate marketing.',
                keywords: 'Affiliate Marketing,Money Making, Online Earning, Blog, Science and Technology,Software and web application development',
                generator: 'Story Book MetaTag Generator v.1.0',
                author: 'Saurabh Kashyap'
            };
            res.render('popular/index', {
                // stories: response.message,
                // pages: totalPages,
                // total: totalCount,
                // page: page
                popular: response.popular,
                pageno: pages
            });
            // return  res.send(JSON.stringify(response));
            // sendres = JSON.stringify(popularpost);

        });
    });
});
module.exports = router;