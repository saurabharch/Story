const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const categories = new Schema({
    categoriesName:{
        type:String,lowercase:true,default:'general'
    }
});

// Create collection and add schema
mongoose.model('category', categories);