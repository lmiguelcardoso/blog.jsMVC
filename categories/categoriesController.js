const express = require('express');
const router = express.Router();
const Category = require('./Category')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')



// SAVE CATEGORY VIEW
router.get('/admin/categories/new',adminAuth,(req,res)=>{
    res.render('admin/categories/new')
})

//SAVE CATEGORY ROUTE
router.post('/categories/save',adminAuth,(req,res)=>{
    let title = req.body.title
    if(title){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect('/admin/categories')
        })
    }else{
        res.redirect('/admin/categories/')
    }
})
// CATEGORY INDEX
router.get('/admin/categories',adminAuth,(req,res)=>{
    Category.findAll().then(Category=>{
        res.render('admin/categories/index',{
            categories: Category
        })
    })

})

// DELETE CATEGORY ROUTE
router.post('/admin/categories/delete',adminAuth,(req,res)=>{
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
        res.redirect('/admin/categories')
        }

        Category.destroy({
            where:{
                id: id
            }
        }).then(res.redirect('/admin/categories'))

    }else{
        res.redirect('/admin/categories')
    }
})

// EDIT CATEGORY VIEW
router.get('/admin/categories/edit/:id',adminAuth,(req,res)=>{
    let id = req.params.id;
    if(isNaN(id)){
        res.redirect('/admin/categories')
    }else{
    Category.findByPk(id).then((category)=>{
        if(category){
            res.render('admin/categories/edit', {
                category: category
            })
        }else{
            res.redirect('/admin/categories')
        }
    })
    
}})


//EDIT CATEGORY ROUTE
router.post('/admin/category/update',adminAuth, (req,res)=>{
    let id = req.body.id;
    let title = req.body.title;

    Category.update({
    title:title,
    slug:slugify(title)
    },
    {
    where:{
        id:id
        }
    }).then(res.redirect('/admin/categories'))

})

module.exports = router;