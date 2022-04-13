const express= require("express");
const path= require("path");
const bcrypt=require("bcryptjs")
const bodyparser=require("body-parser")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const flash = require('connect-flash')
const store = require("store2");
const auth= require("../middleware/auth")
// const models = require("./db/model/feedback-model");

// for user Registration
const models = require("../db/model/feedback-model");
const router =express.Router();

router.use(flash())
// // for user Registration

router.post("/register", async (req, res) => {
    try {
        const register = new models.Register({
            name: req.body.name,
            username: req.body.username,
            phone_number: req.body.phone_number,
            email: req.body.email,
            password: req.body.password

        })

        // const token = await register.generateAuthToken();
        // res.cookie("jwt",token,{
        //     expires:new Date(Date.now()+90000000),
        //     httpOnly:true

        // });
       
        const registersave = await register.save();
        console.log(req.body)
        req.flash('error',{message:"Registration Sucessfully",type:"green"})
        res.status(201).redirect("/login");
        
    } catch (error) {
        console.log(error)
        req.flash('error',{message:"Some error occure while registration",type:"red"})
        res.redirect("/login")
        
        // res.send(` some error occures in registration ${error}`)
    }
});

router.use(cookieParser('secret'))
router.use(session({
    secret: 'secret',
    cookie:{maxAge:null},
    resave:true,
    saveUninitialized:true
})) 
router.use(flash())
// flash message middleware
// router.use((req,res,next)=>{
//     res.locals.message= req.session.message
//     delete req.session.message
//     next()
// })

router.get("/login", (req, res) => {
    const  errorMessage=req.flash('error')[0]
    const token = req.cookies.jwt;
    const author = req.cookies.author;
    res.render("login.ejs",{errorMessage,token,author});
    
})
router.post("/login",async (req,res)=>{
    try{
        // console.log(req.body.username)
        const username =req.body.username;
        const password = req.body.password;


        // for admin login
        

       
            // console.log(`${username} and ${password}`);
     
        const UserName = await models.Register.findOne({username:username});

        

        // not secure way 
        
        //    if(UserName.password===password){
        //       res.status(201).render("news");
        //   }else{
        //       res.send("invallid credintials")
        //   }
        
        
        
        
                const isMatch=await bcrypt.compare(password,UserName.password);
                const token = await UserName.generateAuthToken();
                // console.log(token.Username)
        
                console.log("the token is" + token)
                // console.log("hi")
        
                
                res.cookie("jwt",token,{
                    expires:new Date(Date.now()+5000000),
                    httpOnly:true,
                    
                });
            //    console.log(req.cookies)
               
              
        
                if(isMatch){
                  
                    
                    store( {name: req.body.username}); 
                    console.log(store('name'))
                    const user = await models.Register.findOne({ username: username })
                    console.log(user.location)
                    // console.log("match")
                    req.flash('error',{message:`${req.body.username} login sucessfully`,type:"green"})
                    // res.status(201).render("news.hbs");
                    
                    
                    res.cookie("authorname",store('name'),{
                        expires:new Date(Date.now()+5000000),
                        httpOnly:true,
                        
                    });
                    console.log("this is author cookie",req.cookies.authorname)
                    if(user.AccountType=="admin"){
                        const articles = await models.Article.find().sort({ createdAt: 'desc' })
                        const collegeNews = await models.CollegeNews.find().sort({ createdAt: 'desc' })
                        // res.render("articles/admin.ejs",{ "articles": articles, "collegeNews":collegeNews})
                        res.redirect('/admin')
                    }else{

                        res.redirect('/news')
                    }
                }else{
                    req.flash('error',{message:"invallid credentials",type:"red"})
                    res.redirect('/login')
                }
       

        
    }catch(error){

        
        req.flash('error',{message:"invallid credentials",type:"red"})
        res.redirect('/login')
        console.log("unmatch");
        // res.status(400).send("invallid credentials")
    }
})


// for college news 

router.get("/articles/collegeNews",async (req,res)=>{
    const articles = await models.CollegeNews.find({"status":true}).sort({ createdAt: 'desc' })
    const status = await models.CollegeNews.find({status : true}).sort({ createdAt: 'desc' })

    const token = req.cookies.jwt
    const authorname = req.cookies.authorname
    res.render('articles/collegeNews.ejs',{articles: articles,authorname:authorname,token:token})

  })

  router.get('/articles/collegeNews/:id', async (req, res) => {
    // const article = await models.Article.findOne({ _id: req.params.id })
    const article = await models.CollegeNews.findOne({ _id: req.params.id })
    // if (article== null ) res.redirect('/')
    // console.log(article.status)
    const authorname= req.cookies.authorname;
    const token =req.cookies.jwt
    res.render('articles/show', { article: article,authorname,token })
  })

  
 router.get("/admin",auth, async (req,res)=>{
    const user = await models.Register.findOne({ username: req.cookies.authorname })
    if(user.AccountType=="admin"){

        const articles = await models.Article.find().sort({ createdAt: 'desc' })
        const collegeNews = await models.CollegeNews.find().sort({ createdAt: 'desc' })
        res.render("articles/admin.ejs",{ "articles": articles, "collegeNews":collegeNews})
    }else{
        res.redirect("/UsesrDashboard")
    }
 })

router.get('/logout',auth,async (req,res)=>{
    try{
        // console.log(req.user)
        req.user.tokens=req.user.tokens.filter((currentToken)=>{
            return currentToken.token != req.token
        })
        res.clearCookie("jwt")
        res.clearCookie("authorname")
        await req.user.save()
        console.log("user logout")
        // console.log(req.cookies.jwt)
        // token=req.cookies.jwt;
        req.flash('error',{message:"User logout Successfully",type:"green"})
        // res.render('login.hbs')
        res.redirect('/login')
    }catch(error){
        req.flash('error',{message:"Some error Occurs while Logout",type:"green"})
        // console.log(error)
        res.redirect('/login')
    }
})



module.exports=router;