require('dotenv').config();
const mongoose= require("mongoose");

mongoose.connect('mongodb://localhost:27017/InsideSIGCE2',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true

    }).then(()=>{
    console.log("connection sucessful")
}).catch((e)=>{
    console.log(`connection fails${e}`)
})

// mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@InsideSIGCE.ucp0y.mongodb.net/InsideSIGCE?retryWrites=true&w=majority`,{
//     useNewUrlParser: true,
//      useNewUrlParser: true ,
    


//     }).then(()=>{
//     console.log("connection sucessful via mongo atlas")
// }).catch((e)=>{
//     console.log(`connection fails${e}`)
// })