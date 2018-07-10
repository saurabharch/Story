const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const StorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    bodyImage:{
         type: String
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    comments:[{
        commentBody: {
            type: String,
            require: true
        },
        commentDate: {
            type: Date,
            default: Date.now()
        },
        commentUser: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    date:{
        type: Date,
        default: Date.now()
    },
    likes: [{
        likeCount: {
            type: Number,
            default: 0
        },
        likeDate: {
                type: Date,
                default: Date.now()
            },
            liketUser: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
    }],
    dislikes:[{
         likeCount: {
                 type: Number,
                 default: 0
             },
             likeDate: {
                 type: Date,
                 default: Date.now()
             },
             liketUser: {
                 type: Schema.Types.ObjectId,
                 ref: 'users'
             }
    }],
    rating: [{
                RatedUser: {
                    type: Schema.Types.ObjectId,
                    ref: 'users'
                },
                RateCount: {
                    type: Number,
                    default: 0
                },
                RateDate: {
                    type: Date,
                    default: Date.now()
                },
    }]
});

// Create collection and add schema
mongoose.model('stories', StorySchema,'stories');