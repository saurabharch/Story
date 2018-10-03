const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
// const Category = mongoose.model('categories');
const User = mongoose.model('users');
const axios = require('axios');
const keys = require('../config/keys');
var geoip = require('geoip-lite');
const {ensureAuthenticated,ensureGuest} = require('../helpers/auth');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const s3 = new aws.S3({
    accessKeyId: keys.aws.accessKey,
    secretAccessKey: keys.aws.secretKey
});
const fileSize = 0.1 * 1024 * 1024 // 100kb size limit

// router.use(methodOverride('_method'));
router.get('/', (req, res) =>{
 res.json({
    status: 'success',
    data:'Send Request with Appropriate Request Parameter Field'
    });
});

//START --  User Operational Logic Section with CRUD OPERATION
router.get('/user' ,(req ,res) => {
    let filters = req.query;
    if(req.query.age !=null) {
        filters = {
            age: {$gt: req.query.age}
        }
    }
    User.find(filters)
        .then(user => {
            res.json({
                status: 'success',
                data: user
            });
        })
        .catch(err => {
                res.json({
                    status: 'failed',
                    data: err.message
                });
            });
});

router.get('/user/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
    .then(user =>{
        res.json({
            status: 'success',
            user: user
        });
    })
    .catch(err => {
         res.json({
             status: 'failed',
             data: id +' is Invalid Request id or User is not available'
         });
    })
});

router.get('/user/update',(req,res) => {
    const query = req.query; // require: id, key=value
    const  userid = query.id;
    delete query['id']
        User.findByIdAndUpdate(userid,query, {new:true})
        .then(user => {
            res.json({
                status: 'success',
                data: user
            })
        })
        .catch(err => {
            res.json({
                status: 'failed',
                data: err.message
            });
        })
});

router.post('/user', (req, res) => {
    // User.create(req.body)
    // .then(user => {
    //     res.json({
    //         status: 'success',
    //         data: user
    //     })
    // })
    // .catch(err => {
    //     res.json({
    //         status: 'failed',
    //         data: err.message
    //     })
    // });
     res.json({
         status: 'success',
         data: 'Login/Registeration Only with web now available'
     });
});

router.get('/user/delete', (req,res) => {
    const query = req.query;
    User.findByIdAndRemove(query.id)
    .then(data => {
        res.json({
            status: 'success',
            data: query.id+ ' is successfully removed'
        });
    })
    .catch(err => {
        res.json({
            status: 'failed',
            data: query.id+' is invalid id request'
        });
    });
});

// END --  User Operational Logic Section with CRUD OPERATION

// START -- Stories Operational Logic Section with CRUD OPERATION
router.get('/story', (req, res) => {
    let filters = req.query;
    if (req.query.age != null) {
        filters = {
            age: {
                $gt: req.query.age
            }
        }
    }
    Story.find(filters)
        .then(user => {
            res.json({
                status: 'success',
                data: user
            });
        })
        .catch(err => {
            res.json({
                status: 'failed',
                data: err.message
            });
        });
});

router.get('/story/:id', (req, res) => {
    const id = req.params.id;
    Story.findById(id)
        .then(user => {
            res.json({
                status: 'success',
                user: user
            });
        })
        .catch(err => {
            res.json({
                status: 'failed',
                data: id + ' is Invalid Request id or User is not available'
            });
        })
});

router.get('/story/update', ensureAuthenticated , (req , res) => {
    const query = req.query; // require: id, key=value
    const storyid = query.id;
    delete query['id']
    User.findByIdAndUpdate(req.user.id,storyid, query, {
            new: true
        })
        .then(user => {
            res.json({
                status: 'success',
                data: user
            })
        })
        .catch(err => {
            res.json({
                status: 'failed',
                data: err.message
            });
        })
});;

router.post('/story',ensureAuthenticated, (req, res) => {
    // User.create(req.body)
    // .then(user => {
    //     res.json({
    //         status: 'success',
    //         data: user
    //     })
    // })
    // .catch(err => {
    //     res.json({
    //         status: 'failed',
    //         data: err.message
    //     })
    // });
    res.json({
        status: 'success',
        data: 'Login/Registeration Only with web now available'
    });
});

router.get('/story/delete',ensureAuthenticated, (req, res) => {
    const query = req.query;
    User.findByIdAndRemove(query.id)
        .then(data => {
            res.json({
                status: 'success',
                data: query.id + ' is successfully removed'
            });
        })
        .catch(err => {
            res.json({
                status: 'failed',
                data: query.id + ' is invalid id request'
            });
        });
});
//END -- Stories Operational Logic Section with CRUD OPERATION
//START -- Stories Comments Operational Logic Section with CRUD OPERATION
router.get('/story/comments/:storyid', (req,res) => {
    const storyid = req.params.storyid;
   // let filter = req.query;
    Story.findById(storyid)
    .populate('comments')
    .then(comments =>{
        res.json({
            status: 'success',
            data: comments.comments
        });
    })
    .catch(err => {
        res.json({
            status: 'failed',
            data: storyid+' is invalid request id'
        })
    })
});

router.get('/story/comments/get/:storyid/:id', (req, res) => {
    const storyid = req.params.storyid;
    const commentid = req.params.id;
    // let filter = req.query;
    Story.findOne(storyid)
        .populate('comments')
        .then(story => {
            res.json({
                status: 'success',
                data: story.comments.id(commentid).toString()
            });
        })
        .catch(err => {
            res.json({
                status: 'failed',
                data: storyid + ' is invalid request id'
            })
        })
});


router.get('/db/story/status' , (req, res) => {
    Story.collection.stats()
    .then(report => {
        res.json({
            status: 'success',
            data: report
        })
    })
    .catch(err =>{
        res.json({
            status: 'failed',
            data: 'failed to get the Story Data Collection Status'
        })
    })
});

router.get('/db/user/status', (req, res) => {
    User.collection.stats()
        .then(report => {
            res.json({
                status: 'success',
                data: report
            })
        })
        .catch(err => {
            res.json({
                status: 'failed',
                data: 'failed to get the Story Data Collection Status'
            })
        })
});

router.get('/ip/:ip', (req,res) => {
    var geo = geoip.lookup(req.params.ip);
    res.json({
        status: 'success',
        data: geo
    })
})

router.get('/ip',(req,res) => {
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    res.json({
        status:'success',
        data: ip
    })
});



// Upload function using multer and multer-S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: keys.aws.bucketName,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  }),
  limits: {
    fileSize
  }
});

//S3 Bucket Delete Upload pic when uploading a new one or pic reset
const deleteImage = function (imageKey) {
  const params = {
    Bucket: keys.aws.bucketName,
    Key: imageKey
  };
  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err);
  });
}

//Upload Header Image file of post and save to data base
router.post('/file/story', [ensureAuthenticated, upload.single('bodyImage')], (req, res, next) => {
    Book.findById(req.decoded.stories._id, (err, story) => {
        if (err) return next(err);

        // Delete previous profile pic from AWS S3, if present
        if (story.hasUploadedImage) deleteImage(story.imageKey);

        // Update displayName, password, and/or image data
        // if (req.body.displayName) story.displayName = req.body.displayName;
        // if (req.body.password) story.password = req.body.password;
        if (req.file !== undefined) {
            story.imageURL = req.file.location;
            story.imageKey = req.file.key;
            story.hasUploadedImage = true;
        }
        // Save updates to database
        story.save();
        res.json({
            success: true,
            message: 'Student Profile information saved successfully'
        });
    });
});
module.exports = router;