const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema
const CategoriesSchema = new Schema({
    categoriesName:{
        type:String,lowercase:true,default:'general'
        
    },
    userCategory:[{
        userid:{
             type: Schema.Types.ObjectId,
                 ref: 'users'
        },
        dateTime:{
            type:Date,
            default:Date.now()
        }
    }]

});

// Create collection and add schema
mongoose.model('categories', CategoriesSchema);