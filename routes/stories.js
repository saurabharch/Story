const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
// const Category = mongoose.model('categories');
const User = mongoose.model('users');
const axios = require('axios');
const keys = require('../config/keys');
const {ensureAuthenticated,ensureGuest} = require('../helpers/auth');
// const conn = mongoose.createConnection(keys.mongoURI);
//Story Index

likescount = [];
dislikecount = [];
ratedusers = [];
hostAddress = '';
router.get('/', (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var size = parseInt(req.query.size) || 5;
   // console.log(`page: ${page}, size: ${size} `);
    var query = {
        status: 'public'
    };
      if (page < 0 || page === 0) {
          stories = {
              "error": true,
              "message": "invalid page number, should start with 1"
          };
          return res.json(stories);
      }
    query.skip = size * (page - 1);
    query.limit = size;
    query.populate = 'user';
    query.sort = {
        views:-1,
        date:-1
    };
    // Find some latest post by views count documents
    Story.count({status:'public'}, function (err, totalCount) {
        if (err) {
            stories = {
                "error": true,
                "message": "Error fetching data"
            }
        }
        Story.find({}, {}, query, function (err, stories, response) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                 var totalPages = Math.ceil(totalCount / size);
                 response = {
                     "error": false,
                     "message": stories,
                     "pages": totalPages
                 };
            }
            res.locals.metaTags = {
                title: 'StoryBook',
                description: 'StoryBook is an award winning blog that talks about living a boss free life with blogging. We cover about WordPress, SEO, Make money Blogging, Affiliate marketing.',
                keywords: 'Affiliate Marketing,Money Making, Online Earning, Blog, Science and Technology,Software and web application development',
                generator: 'Story Book MetaTag Generator v.1.0',
                author: 'Saurabh Kashyap'
            };
            res.render('stories/index', {
                stories: response.message,
                pages: totalPages,
                total: totalCount,
                page:page
            });
            // console.log(stories);
            //res.json(stories);
        });
    });
});

router.get('/popular/:page', (req, res) => {
  var pages = parseInt(req.params.page) ;
  var size = parseInt(req.query.size);
  var popular = {
      status: 'public'
  };
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
          res.render('stories/popular', {
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
//Show Single Stories
router.get('/show/:id', (req, res) => {
    //  console.log(quantity);
    hostAddress = req.params;
    console.log(hostAddress);
    const obajectid = req.params.id.replace('app.js', '').replace('\n', '');
    Story.findOne({
            _id: mongoose.Types.ObjectId(obajectid)
        })
        .populate('user')
        .populate('comments.commentUser')
        .populate('likes.likeUser')
        .populate('dislikes.likeUser')
        .populate('rating.RatedUser')
        .then(story => {
            if (story.status == 'public') {
                Story.findOneAndUpdate({
                    _id: mongoose.Types.ObjectId(obajectid)
                }, {
                    $inc: {
                        views: 1
                    }
                }, {
                    new: true
                }, function (err, response) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(response);
                    }
                });
                res.locals.metaTags = {
                    title: story.title,
                    description: story.description,
                    keywords: story.keywords,
                    generator: 'Story Book MetaTag Generator v.1.0',
                    author: story.user.firstName + " " + story.user.lastName
                };
                res.render('stories/show', {
                    story: story,
                    likescount: story.likes,
                    dislikecount: story.dislikes,
                    ratedusers: story.rating,
                    layout: "main"
                });
            } else {
                if (req.user) {
                    if (req.user.id == story.user._id) {

                        res.render('stories/show', {
                            story: story
                        });
                    } else {
                        res.redirect('/stories');
                    }

                } else {
                    res.redirect('/stories');
                }
            }
        });


});

// Show Single Stories By Writer
router.get('/user/show/:id', (req, res) => {
    //  console.log(req.headers.referer);
  
    hostAddress = req.protocol + '://' + req.get('host') + req.originalUrl;
    const obajectid = req.params.id.replace('app.js', '').replace('\n', '').replace('new-install.js','');
    Story.findOne({
            _id: mongoose.Types.ObjectId(obajectid)
        })
        .populate('user')
        .populate('comments.commentUser')
        .populate('likes.likeUser')
        .populate('dislikes.likeUser')
        .populate('rating.RatedUser')
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
                res.render('stories/show', {
                    story: story,
                    likescount: story.likes,
                    dislikecount: story.dislikes,
                    ratedusers: story.rating,
                    url:hostAddress,
                    layout: "main"
                });
            } else {
                if (req.user) {
                    if (req.user.id == story.user._id) {

                        res.render('stories/show', {
                            story: story,
                            user: user
                        });
                    } else {
                        res.redirect('/stories');
                    }

                } else {
                    res.redirect('/stories');
                }
            }
        });


});


router.put('/storyhit/:id', ensureGuest, (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        story.save()
            .then(story => {
                res.JSON.stringyfy(story);
            });
    });
});

//List Stories from a user
router.get('/user/:userId', ensureGuest, (req, res) => {
    Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});

//Logged in Users Stories
router.get('/my', ensureAuthenticated, (req, res) => {
    console.log(req.user.id);
    Story.find({
            user: req.user.id
        })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});
//Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    console.log('redirect hit');
    res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    const requerstId = req.params.id.replace('app.js', '').replace('\n', '');
    Story.findOne({
            _id: mongoose.Types.ObjectId(requerstId)
        })
        .then(story => {
            if (story.user != req.user.id) {
                res.redirect('/stories');
            } else {
                res.render('stories/edit', {
                    story: story
                });
            }
        });
});

//Process Add Story
router.post('/', ensureAuthenticated, (req, res) => {
    let allowComments;
    let likes = 0;
   const url = req.protocol + '://' + req.get('host');
    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }
    const newStory = {
        title: req.body.title,
        body: req.body.body,
        bodyImage: req.body.bodyImage,
        status: req.body.status,
        category: req.body.categoryType,
        allowComments: allowComments,
        user: req.user.id,
        likes: likes,
        description: req.body.description,
        keywords: req.body.keywords
    };

    //Create Story
    new Story(newStory)
        .save()
        .then(story => {
            
            axios.post(url+'/push', {
                   "title": story.title,
                       "message": story.description,
                       "url": url + '/stories/user/show/' + story.id,
                       "ttl": 36000,
                       "icon": url + '/img/book-192X192.png',
                       "badge": url + '/img/book-192X192.png',
                       "tag": story.keywords
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            // PushBroadCast(url + '/push', pushMessage);
            res.redirect(`/stories/show/${story.id}`);
        });
});

router.put('/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {
            let allowComments;
            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }
            //New values
            story.title = req.body.title;
            story.body = req.body.body;
            story.status = req.body.status;
            story.category = req.body.categoryType;
            story.bodyImage = req.body.bodyImage;
            story.allowComments = allowComments;
            story.description = req.body.description;
            story.keywords = req.body.keywords;
            story.save()
                .then(story => {
                    res.redirect('/dashboard');
                });
        });

});

router.post("/thumbup/:id", ensureAuthenticated, (req, res) => {
   // console.log(req.body);
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        if (req.params.id !== story.likes.likeUser) {
            const newlike = {
                likeCount: 1,
                likeUser: req.user.id
            }
            //Add to comments array
            story.likes.unshift(newlike);

            story.save()
                .then(story => {
                    res.redirect(`/stories/show/${story.id}`);
                });
        } else {
            res.redirect(`/stories/show/${story.id}`);
        }
    });
});

router.post('/rating/:id',ensureAuthenticated, (req, res) => {
    const value = req.query.rate;
    console.log(value);
    Story.findByIdAndUpdate({
            _id: req.params.id
        }).then(story => {
            if (req.params.id !== story.rating.RatedUser && parseInt(value) <= 6) {
            const newRate = {
                RateValue: value,
                RateUser: req.user.id
            }
            console.log(newRate);
            //Add to comments array
            story.rating.unshift(newRate);
            story.save()
                .then(story => {
                    res.redirect(`/stories/show/${story.id}`);
                });
            } else {
                res.redirect(`/stories/show/${story.id}`);
            }
        })
        .catch(err => {
            res.redirect(`/stories/show/${story.id}`);
        })
})
//Delete Story/
router.delete(('/:id'), ensureAuthenticated, (req, res) => {
    Story.remove({
            _id: req.params.id
        })
        .then(() => {
            res.redirect('/dashboard');
        });
});

//Add Comment
router.post('/comment/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .then(story => {
            const newComment = {
                commentTitle: req.body.commentTitle,
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }
            //Add to comments array
            story.comments.unshift(newComment);

            story.save()
                .then(story => {
                    res.redirect(`/stories/show/${story.id}`);
                });
        });
});

// router.post('/addcategory/:id',ensureAuthenticated, (req, res) => {
//    if(req.body.category != null){
//         const newCategory = {
//         categoriesName: req.body.category
//     };
//  console.log(newCategory);

//     //Create Story
//     new Category(newCategory)
//         .save()
//         .then(category => {
//             res.redirect(`/stories/add`);
//         });
//    }else{
//        console.log('Request can not accesible');
//    }
// });
module.exports = router;