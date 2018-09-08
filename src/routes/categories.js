const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const Category = mongoose.model('categories');
const User = mongoose.model('users');
const keys = require('../config/keys');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');



router.post('/add/:id',(req,res) => {
   if(req.body.category != null){
        const newCategory = {
        categoriesName: req.body.category
    };    
    //Create Story
    new Category(newCategory)
        .save()
        .then(category => {
            res.redirect(`/stories/add`);
        });
   }else{
       console.log('Request can not accesible');
   }
})
//Add Category Form
router.get('/:id',ensureAuthenticated, (req, res) => {
    Category.find({
        categoriesName: req.params.id
    }).then(category => {
        category:category,
        console.log(category);
        
    })
});

//Get Category 
router.get('/edit/:id',ensureAuthenticated,(req,res) => {

    console.log(req.params.id);
     Category.findById({
        _id: '5b71e32f695ec11de053cf47'
    })
        .then(categories => {
            // if (categories.categoriesName) {
            //     res.redirect('/stories/edit');
            // }
            // } else {
            //     res.render('stories/edit', {
            //         story: story
            //     });
                
            // }
            // category:categories,
            console.log(categories);
        });
});

//Update Category
router.put('/edit/:id',ensureAuthenticated,(req,res) => {
   if(req.body.category != null){
      Category.findById({
        _id: req.params.id
    })
        Category.categoriesName = req.body.category;
        Category.save()
                .then(category => {
                    res.redirect('/stories/add');
                });
   } else {
        res.redirect('/stories/add');
   }
})
module.exports = router;