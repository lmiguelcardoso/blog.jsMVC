const express = require('express');
const router = express.Router();
const User = require('./User')
const bcrypt = require('bcryptjs');
const bcryptjs = require('bcryptjs');


// USERS LIST
router.get('/admin/users',(req,res)=>{
    User.findAll().then(users=>{
        res.render('./admin/users/index',{
            users: users
        })
    })
   
})
// CREATE USER VIEW
router.get('/admin/users/create',(req,res)=>{
    res.render('admin/users/create')

})
// CREATE USER ROUTE
router.post('/user/create',(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where:{email:email}}).then(user=>{
        if(user == undefined){
            let salt = bcrypt.genSaltSync(10)
            let hash = bcryptjs.hashSync(password, salt)
        
            User.create({
                email: email,
                password: hash
            }).then(()=>{
                res.redirect('/')
            }).catch(()=> res.redirect('/'))
        }else{
            res.redirect('/admin/user/create')
        }
    })
   
})
module.exports = router