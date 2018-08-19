const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const UserSchema = new Schema({
    sociaID: {
        type: String,
        required: true,
        unique:true
    },
    provider:{
        type:String,
        required:true
    },
    email: {
        type: String,
         unique: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    },
    twitterId:{
        type:String,
         unique: true
    },
    googlePlus: {
        type: String,
         unique: true
    },
    facebookPage: {
        type: String
    },
    facebookId:{
        type:String,
         unique: true
    },
    youtubelink:{
        type:String,
         unique: true
    }
});

// Create collection and add schema
mongoose.model('users', UserSchema);