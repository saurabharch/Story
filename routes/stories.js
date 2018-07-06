const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

//Story Index
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
//Show Single Stories
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .populate('likes.likeUser')
    .then(story => {
        if(story.status == 'public') {
            res.render('stories/show' , {
                story:story
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
        console.log(story.likes);
    });
});

//List Stories from a user
router.get('/user/:userId', (req, res) => {
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
    Story.findOne({
        _id: req.params.id
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
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id,
        likes: likes
    };

    //Create Story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        });
});

router.put('/:id', (req, res) => {
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
            story.allowComments = allowComments;
            story.save()
                .then(story => {
                    res.redirect('/dashboard');
                });
        }); 
});

router.post("/thumbup/:id", (req, res) => {
    Story.findById({
        _id: req.params.id
    }).then(story => {
            if(req.params.id === story.likes.likeUser && story.likes._id !== req.param.id){
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
        }
    )
});
//Delete Story/
router.delete(('/:id'), (req, res) => {
    Story.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/dashboard');
        });
});

//Add Comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id:req.params.id
    })
    .then(story => {
        const newComment = {
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
module.exports = router;