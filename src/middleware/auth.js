const jwt= require("jsonwebtoken")
const models= require("../db/model/feedback-model");

const auth = async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        // console.log(verifyUser);

        const user= await models.Register.findOne({_id:verifyUser._id});
        // console.log(user)
        req.token =token;
        req.user=user
        next();

    }catch(error){
        
        res.redirect("../login")
        // res.status(401).send(error);

    }
}
module.exports=auth;
