const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const session = require('express-session')

//DB CONNECTION
const connection = require('./database/database.js')
//CONTROLLER REQUIRE
const categoriesController = require('./categories/categoriesController.js')
const articlesController = require('./articles/articlesController.js');
const usersController = require('./users/usersController')
//MODEL REQUIRE
const Article = require('./articles/Articles.js');
const Category = require('./categories/Category.js');
const User = require('./users/User')



//DATABASE
connection.authenticate().then(()=>console.log('Sucess')).catch((error)=>console.log(error))
//VIEW ENGINE
app.set('view engine','ejs')
//BODY PARSER - FORMS
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//STATIC FILES
app.use(express.static('public'))
//SESSIONS
app.use(session({
    secret:'fjnsanjfasnfasjfnsa',
    cookie:{maxAge:36000000}
}))


//ROUTES
app.use("/",articlesController)
app.use("/",categoriesController)
app.use("/", usersController)

// INDEX VIEW
app.get('/',(req,res)=>{
    Article.findAll({
        order:[['id', 'DESC']],
        limit: 4
    }).then((articles)=>{
        Category.findAll().then(categories=>{
            res.render('index',{articles:articles, categories: categories})})
        })
})
// ARTICLE VIEW 
app.get('/:slug',(req,res)=>{
    let slug = req.params.slug;

    Article.findOne({
        where:{slug: slug}
    }).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories=>{
                res.render('article',{article: article, categories:categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch(error=>{
        res.redirect('/')
    })

})
// ARTICLES BY CATEGORY VIEW
app.get('/category/:slug',(req,res)=>{
    let slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug
        },
        include: [{model: Article}]
    }).then(category=>{
        if(category != undefined){
            Category.findAll().then(categories=>{
                res.render('index',{articles: category.articles, categories:categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch(error=>res.redirect('/'))
})

app.listen(3000,()=>{
    console.log("server running on port 3000")
})