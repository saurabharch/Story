const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
// const Category = mongoose.model('categories');
const User = mongoose.model('users');
const keys = require('../config/keys');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
// const conn = mongoose.createConnection(keys.mongoURI);
//Story Index

likescount = [];
dislikecount = [];
ratedusers = [];
router.get('/',(req, res) => {
    Story.find({status:'public'})
        .populate('user')
        .sort({date:'desc'})
        .then(stories => {
             res.render('stories/index', {
                 stories: stories
             });
        });
   
});

// Get Tags Data of single Story 
router.get('/tags/:id'), (req,res) => {
  const obajectid = req.params.id.replace('app.js', '').replace('\n', '');
  Story.findOne({
      _id: mongoose.Types.ObjectId(obajectid)
  })
  .populate('metaData')
  .then(story => {
      if (story.status == 'public') {
         res.JSON.stringyfy(story);
      }
  });
};
//Show Single Stories
router.get('/show/:id', (req, res ) => {
        //  console.log(quantity);
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
        if(story.status == 'public') {
              res.locals.metaTags = {
                  title: story.title,
                  description: story.description,
                  keywords: story.keywords,
                  generator:'Story Book MetaTag Generator v.1.0',
                  author: story.user.firstName +" "+ story.user.lastName
              };
            res.render('stories/show' , {
               story:story,
               likescount: story.likes,
               dislikecount: story.dislikes,
               ratedusers:story.rating,
                layout: "main"
            });
        } else {
           if(req.user){
               if(req.user.id == story.user._id){

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
router.get('/user/stories/show/:id', (req, res) => {
    //  console.log(quantity);
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


router.put('/storyhit/:id',ensureGuest, (req, res) => {
 Story.findOne({
     _id: req.params.id
 }).then(story => {
   story.save()
       .then(story => {
           res.redirect('/dashboard');
       });
 });
});

//List Stories from a user
router.get('/user/:userId',ensureGuest, (req, res) => {
    Story.find({user: req.params.userId , status:'public'})
    .populate('user')
    .then(stories => {
        res.render('stories/index', {
            stories:stories
        });
    });
});

//Logged in Users Stories
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({ user: req.user.id })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});
//Add Story Form
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    const requerstId = req.params.id.replace('app.js','').replace('\n','');
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
    if(req.body.allowComments){
        allowComments= true;
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
            res.redirect(`/stories/show/${story.id}`);
        });
});

router.put('/:id',ensureAuthenticated, (req, res) => {
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
            story.keywords= req.body.keywords;
            story.save()
                .then(story => {
                    res.redirect('/dashboard');
                });
        }); 

});

router.post("/thumbup/:id", ensureAuthenticated, (req, res) => {
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


//Delete Story/
router.delete(('/:id'),ensureAuthenticated, (req, res) => {
    Story.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/dashboard');
        });
});

//Add Comment
router.post('/comment/:id',ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id:req.params.id
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