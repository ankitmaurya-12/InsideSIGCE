const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken")
const store = require("store2");
// const { default: isBoolean } = require("validator/lib/isboolean");
const feedbackSchema = new mongoose.Schema({
   
   username :{
       type: String,
       required:true
       
   },
   email :{
       type:String,
       required:true
   },
   message :{
       type: String,
       required:true
   }
    
  },{ timestamps: true });

  const Feedback =new mongoose.model("Feedback",feedbackSchema);

//   module.exports=Feedback;


//   for register schema
  const registerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username :{
        type: String,
        required:true,
        unique:true
        
    },
    email :{
        type:String,
        required:true,
        
    },
    phone_number:{
        type: String,
        required:true
    },
    password :{
        type:String,
        required : true
    },
    AccountType :{
        type:String,
        default: "local"

    },
    location:{
        type:String,
        default:"null"
    },

    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
    
     
   },{ timestamps: true });

 
   registerSchema.methods.generateAuthToken = async function(){
       try{
           console.log(this._id)
           
            const token =jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
            this.tokens= this.tokens.concat({token:token})
            console.log("this is token  " +token);
            // console.log(token:username)
            await this.save();
            return token;
       }catch(error){
        //    res.send("The error part page " + error)
            console.log("this is error in jwt")
       }
   }

   registerSchema.pre("save",async function(next){

    if(this.isModified("password")){

        this.password=await bcrypt.hash(this.password,10)
        console.log(`the password is ${this.password}`)
    }
    
       
       next();
   })

   
   const Register =new mongoose.model("Register",registerSchema);



//    for article  local news

const articleSchema = new mongoose.Schema({

    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    
    Author_name: {
      type : String,
      // required:true,
      default :store('name')
      
    },
    image: {
      data: Buffer,
      contentType: String
  },
  newsType:{
      type : String,
      default: "local"
  },
  
  location :{
      type: String,
      required: true
    
      
  },
  status:{
    type: Boolean,
    default : false
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
  
 
  })
  const Article= new mongoose.model("Article",articleSchema)

//   for college news schema 

const CollegeNewsSchema = new mongoose.Schema({

    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    
    Author_name: {
      type : String,
      required:true,
      default :store('name')
      
    },
    image: {
      data: Buffer,
      contentType: String
  },
  newsType:{
    type : String,
    default: "college"
},
  
  location :{
      type: String,
      required: true
   
      
  },
  status:{
    type: Boolean,
    default : false
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
  
 
  })
  const CollegeNews= new mongoose.model("CollegeNews",CollegeNewsSchema)

//    exporting feedback and register module

  module.exports={Feedback,Register,Article,CollegeNews}

  
     
  