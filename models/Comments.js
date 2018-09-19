const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema
const CommentsSchema = new Schema({
  commentBody: {
          type: String,
          require: true,
          lowercase: true
      },
      commentTitle: {
          type: String,
          require: true,
          lowercase: true
      },
      commentDate: {
          type: Date,
          default: Date.now()
      },
      commentUser: {
          type: Schema.Types.ObjectId,
          ref: 'users'
      },
      stories:{
          type: Schema.Types.ObjectId,
          ref: 'stories'
      }

});

// Create collection and add schema
mongoose.model('comments', CommentsSchema);