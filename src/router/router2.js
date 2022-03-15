const express= require("express");
const path = require("path")
const bodyparer = require("body-parser")
const methodOverride = require('method-override')
// const Article= require("../db/model/articles")
const models =require("../db/model/feedback-model");
const { urlencoded } = require("express");
const { findOne } = require("../db/model/articles");
const auth= require("../middleware/auth")
const router2 =express.Router();

const store = require("store2");
router2.use(express.json());
router2.use(express.urlencoded({ extended: false }));
router2.use(methodOverride('_method'))

var fs = require('fs');
// var path = require('path');
require('dotenv/config');

require("../db/Connection/connection");

var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() +
		path.extname(file.originalname))
	}
});

var upload = multer({ 
	storage: storage,
	limits:{fileSize:1000000000}
 });


router2.get('/', async(req, res) => {
    const articles = await models.Article.find().sort({ createdAt: 'desc' })
    const status = await models.Article.find({status : true}).sort({ createdAt: 'desc' })
 
    // console.log(status)
    
    res.render('articles/index.ejs', { articles: articles })
})

router2.get('/upload',auth, async (req, res) => {
  
  const user = await models.Register.findOne({ username: req.cookies.authername })
  let params = { 
    authername:req.cookies.authername,
    location : user.location
    
  }
  
 
 
  if(user.AccountType=="college"){
      res.render('articles/collegeUpload.ejs',params)
    }else{
      res.render('articles/upload.ejs',params)
      }
     
})





 
// router2.post('/new', async (req,res)=>{
  
//     try {
//         const articlesmodel = new models.Article({
//            title : req.body.title,
//            description :req.body.description,
//            markdown : req.body.markdown,
//            location :req.body.location,
//            Auther_name: req.cookies.authername
          
           
//            })  

           
//         const articlesave = await articlesmodel.save();
//         // res.send("save");
//         res.send("ok")

//     }catch (error) {

//         res.send(`some error occures ${error}`)
//     }


// });

router2.post('/upload', upload.single('image'), async (req, res,err) => {

    console.log(this._id)
    

    try {
      console.log(__dirname)
      
      const articlesmodel = new models.Article({
         title : req.body.title,
         description :req.body.description,
       
         location :req.body.location,
         Auther_name: req.cookies.authername,
         
         
         image: {
          data : fs.readFileSync(path.join( 'uploads/' + req.file.filename)),
          contentType: 'image/png'
             }
        }) 



	      console.log("save")
	
         const articlesave = await articlesmodel.save();
         // res.send("save");
         res.send("ok");
        }catch(error){
          res.send(`some error occures while uploading ${error}`)
        }

        

 });


    
	
router2.get('/:id', async (req, res) => {
    const article = await models.Article.findOne({ _id: req.params.id })
    if (article == null) res.redirect('/')
    console.log(article.status)
    res.render('articles/show', { article: article })
  })

  
  

  router2.delete('/:id', async (req, res) => {
    const deletedID =await models.Article.findByIdAndDelete(req.params.id)
    console.log(deletedID)
    res.redirect('/articles')
  })

  router2.get('/Approved/:id', async(req,res)=>{
    // req.article= await Article.findById(req.params.id).updateOne
    models.Article.updateOne({_id: req.params.id},  {status:true}, (err,likedpost)=>{
      if(err) console.log(err)
        else{
            res.send("Article Approved");
        }
    })
  })
  router2.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
  }, saveArticleAndRedirect('edit'))

  function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      console.log(article)
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
      } catch (e) {
        res.render(`articles/${path}`, { article: article })
      }
    }
  }


  // for admin 


router2.get('/admin', (req, res) => {
    res.render('articles/upload.ejs')
})
 
  
 

module.exports=router2;