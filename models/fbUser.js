const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const FbUserSchema = new Schema({
    fbID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    }
});

// Create collection and add schema
mongoose.model('users', FbUserSchema);