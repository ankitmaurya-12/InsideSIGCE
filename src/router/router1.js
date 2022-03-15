const express= require("express");
const path= require("path");
const bcrypt=require("bcryptjs")
const bodyparser=require("body-parser")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const flash = require('connect-flash')
const store = require("store2");

// const models = require("./db/model/feedback-model");

// for user Registration
const models = require("../db/model/feedback-model");
const router =express.Router();


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

        const token = await register.generateAuthToken();
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+90000000),
            httpOnly:true

        });
       
        const registersave = await register.save();
        res.status(201).render("news.hbs");
        console.log(req.body)
        
    } catch (error) {
        res.render("index.hbs")
        
        res.send(` some error occures in registration ${error}`)
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
    const  username=req.flash('error')
    res.render("login.hbs",{username});
    
})
router.post("/login",async (req,res)=>{
    try{
        // console.log(req.body.username)
        const username =req.body.username;
        const password = req.body.password;


        // for admin login
        if(username=="Admin123" && password=="pass"){
            const articles = await models.Article.find().sort({ createdAt: 'desc' })
            res.render("articles/admin.ejs",{ articles: articles })
         
            
        }

       else{
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
                    expires:new Date(Date.now()+90000000),
                    httpOnly:true,
                    
                });
               console.log(req.cookies)
               
              
        
                if(isMatch){
                  
                    
                    store( {name: req.body.username}); 
                    console.log(store('name'))
                    const user = await models.Register.findOne({ username: username })
                    console.log(user.location)
                    // console.log("match")
                   
                    res.status(201).render("news.hbs");
                    
                    
                    res.cookie("authername",store('name'),{
                        expires:new Date(Date.now()+90000000),
                        httpOnly:true,
                        
                    });
                    console.log("this is auther cookie",req.cookies.authername)
                }else{
                    // req.session.message={
                    //     type:'danger',
                    //     intro :'Empty-field',
                    //     message:'invallid credintials'
                    // }
                    // req.flash('error',req.body.username)
                    req.flash('error',"invallid credintial")
                    res.redirect('/login')
                    console.log("unmatch");
                    // res.send("invallid credintials")
                }
       }

        
    }catch(error){
        
    res.status(201).render("login.hbs");
        // res.status(400).send("invallid credentials")
    }
})
// router.get('/new', async (req, res) => {
//     // const auther = "hie"
//     // UserName : await models.Register.findOne({username:"username})
//     //  const UserName="hi"
    //   res.render('articles/new.ejs',{auther: auther})
//   })
//   console.log(auther)
module.exports=router;