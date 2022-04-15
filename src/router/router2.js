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

// require("../db/Connection/connection");

var multer = require('multer');
const { route } = require("./router1");

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
	limits:{fileSize:9000000}
 });


router2.get('/', async(req, res) => {
    const articles = await models.Article.find().sort({ createdAt: 'desc' })
    const status = await models.Article.find({status : true}).sort({ createdAt: 'desc' })
//  console.log(articles)
    // console.log(status)
    const token = req.cookies.jwt;
    const authorname = req.cookies.authorname;

    res.render('articles/index.ejs', {data:{ articles: articles,token:token },authorname})
})

router2.get('/upload',auth, async (req, res) => {
  if( !req.cookies.authorname ){
    res.redirect('back')
  }
  
  const user = await models.Register.findOne({ username: req.cookies.authorname })
  let params = { 
    authorname:req.cookies.authorname,
    location : user.location,
    AccountType : user.AccountType
    
  }
  const token = req.cookies.jwt; 
  // const authorname = req.cookies.author; 
 
  const  errorMessage=req.flash('error')[0]

  if(user.AccountType=="college"){
      res.render('articles/collegeUpload.ejs',{ data: { params: params, errorMessage: errorMessage },token })
    }else{
      // res.render('articles/upload.ejs',{params},{errorMessage})
      res.render('articles/upload.ejs', { data: { params: params, errorMessage: errorMessage },token })

      }
     
})




router2.post('/upload', upload.single('image'), async (req, res,err) => {

    console.log(this._id)
    const user = await models.Register.findOne({ username: req.cookies.authorname })
    let params = { 
      authorname:req.cookies.authorname,
      location : user.location,
      AccountType : user.AccountType
      
    }

    if(user.AccountType=="local" ||user.AccountType=="admin"){

    
        try {
           console.log(__dirname)
           console.log(user.AccountType)
      
            const articlesmodel = new models.Article({
              title : req.body.title,
              description :req.body.description,
       
               location :req.body.location,
               Author_name: req.cookies.authorname,     
               image: {
                data : fs.readFileSync(path.join( './uploads/' + req.file.filename)),
                contentType: 'image/png'
                  }
              }) 



              const articlesave = await articlesmodel.save();
              console.log("save")

              
              // res.redirect('../articles')
              req.flash('error',{message:"Article Uploaded Successfully",type:"green"})
              res.redirect("back")
 
    
            }catch(error){
              // res.send(error)
              req.flash('error',{message:"Some error Occurs while Uploading Article",type:"red"})
              res.redirect('back')
            }

      }else{
        try {
          console.log(user.AccountType)
        const CollegeNewsmodel = new models.CollegeNews({
          title : req.body.title,
          description :req.body.description,
   
          // location :req.body.location,
          location :user.location,
           Author_name: req.cookies.authorname,
           image: {
            data : fs.readFileSync(path.join( './uploads/' + req.file.filename)),
            contentType: 'image/png'
              }
          }) 



          const CollegeNewsSave = await CollegeNewsmodel.save();
          console.log("save")

          req.flash('error',{message:"Article Uploaded Successfully",type:"green"})
          res.redirect('back')


        }catch(error){
          req.flash('error',{message:"Some error Occurs while Uploading Article",type:"red"})
          res.redirect('back')
          // res.send(error)
      }
    }

 });


    
	
router2.get('/:id', async (req, res) => {
    const article = await models.Article.findOne({ _id: req.params.id })
    const authorname = req.cookies.authorname;
    // const articlez = await models.Article.findOne({ _id: req.params.id })
    if (article == null) res.redirect('/')
    // console.log(article.status)
    const token = req.cookies.jwt;
    res.render('articles/show', { article: article,token:token,authorname })
  })

  
  

  router2.delete('/:id', async (req, res) => {
    const deletedID =await models.Article.findByIdAndDelete(req.params.id)
    // console.log(deletedID)
    res.redirect('back')
  })

  router2.get('/Approved/:id', async(req,res)=>{
    // req.article= await Article.findById(req.params.id).updateOne
    models.Article.updateOne({_id: req.params.id},  {status:true}, (err,likedpost)=>{
      if(err) console.log(err)
        else{
          res.redirect('/admin')
            // res.send("Article Approved");
            // res.redirect('back')
        }
    })
  })
  

  // to delete college form dashboard news delete
  router2.delete('/collegeNews/:id', async (req, res) => {
    try{
        // console.log("hi")
        const deletedID =await models.CollegeNews.findByIdAndDelete(req.params.id)
        res.redirect('/admin')
    // res.redirect('back')
    }catch(error){
   console.log(error)
   res.statusCode(404)
    }
  })

  // approve college news 
  router2.get('/CollegeNews/Approved/:id', async(req,res)=>{
    // req.article= await Article.findById(req.params.id).updateOne
    models.CollegeNews.updateOne({_id: req.params.id},  {status:true}, (err,likedpost)=>{
      if(err) console.log(err)
        else{
            // res.send("Article Approved");
            res.redirect('/admin')
        }
    })
  })
 

  // router2.get("/college-news",async (req,res)=>{
  //   res.render("articles/collegeNews.ejs")
  // })

 
 
  
 

module.exports=router2;