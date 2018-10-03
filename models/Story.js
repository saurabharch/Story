const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

// Create Schema
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
        default: 'public',
        lowercase:true
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    category:{
        type:String,
        default:'general',
        lowercase:true
    },
    comments:[{
        commentBody: {
            type: String,
            require: true,
            lowercase:true
        },
        commentTitle:{
            type:String,
            require:true,
            lowercase:true
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
            likeUser: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                unique: true
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
                 ref: 'users',
                 unique: true
             }
    }],
    rating: [{
                RatedUser: {
                    type: Schema.Types.ObjectId,
                    ref: 'users'
                },
                RateValue: {
                    type: Number,
                    default: 0
                },
                RateDate: {
                    type: Date,
                    default: Date.now()
                },
    }],
   views: {
       type: Number,
       default: 0
   },
    keywords:{
        type:String,
        lowercase:true
    },
    description:{
        type:String,
        lowercase:true
    }
});
StorySchema.plugin(mongoosePaginate);
// Create collection and add schema
mongoose.model('stories', StorySchema,'stories');