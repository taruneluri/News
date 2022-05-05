const mongoose=require('mongoose');
var  schema=mongoose.Schema;
var user=new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("User",user);