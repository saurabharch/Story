const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const SubscriberSchema = new Schema({
     endpoint:String,
         keys: Schema.Types.Mixed,
         createDate: {
             type: Date,
             default: Date.now
         }
});

mongoose.model('push_subscriber', SubscriberSchema, 'push_subscriber');