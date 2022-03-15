require('dotenv').config();
const express = require("express");
const path = require("path")
const app = express();
// const vaildator= require("validator")
const bodyparer = require("body-parser")
const hbs = require("hbs");

const bcrypt = require('bcryptjs');
const cookieParser= require("cookie-parser");

const auth=require("./middleware/auth")

require("./db/Connection/connection");
const models = require("./db/model/feedback-model");
// const Article = require("./db/model/articles")
const { urlencoded } = require("express");
const { model } = require("mongoose");
const session = require("express-session")
// const cookieParser = require("cookie-parser")

// const { json }=require("express")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

const port = process.env.PORT || 80;

app.set("view engine", "hbs",)
app.set("view engine", "ejs",)

const static_path = path.join(__dirname, "../public")
console.log(static_path)
app.use(express.static(static_path))




const templte_path = path.join(__dirname, "../src/templates/views")
const partials_path = path.join(__dirname, "../src/templates/partials")
hbs.registerPartials(partials_path)


app.set("views", templte_path)

 console.log(process.env.SECRET_KEY)



// routeing 

app.get("/", (req, res) => {
    res.render("index.hbs")
})
app.get("/index", (req, res) => {
    res.render("index.hbs");
})

// app.get("/login", (req, res) => {
//     const error = "hi"
//     res.render("login.hbs",{error:error});
    
// })

app.get("/news", (req, res) => {
    res.render("news.hbs")
})


app.get("/global-news", (req, res) => {
    res.render("global.hbs")
})
// app.get("/admin", (req, res) => {
//     res.render("articles/admin.ejs")
// })

// app.get("/articles/new", auth ,(req,res)=>{
//     console.log(`this is cookies  ${req.cookies.jwt}`)
//     res.render("articles/new.ejs");
    
// })




//  for feedback

app.post("/feedback", async (req, res) => {

    try {
        const feedback = new models.Feedback({
            username: req.body.username,
            email: req.body.email,
            message: req.body.message
        })
        const feedbacksave = await feedback.save().then(() => {
            res.send("Your feedback submitted")

        }).catch(() => {
            res.send("Some error while submitting feedback")
        })


        //  res.status(201).render("news")
        console.log(req.body)
    } catch (error) {

        res.send(`some error occures ${error}`)
    }


});


const router=require("./router/router1");
app.use(router);

const router2 = require("./router/router2");
app.use('/articles', router2)



app.listen(port, () => {
    console.log(`server is running on port number ${port}`);
})

