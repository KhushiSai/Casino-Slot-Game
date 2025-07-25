 const mongoose=require('mongoose')
 const userSchema=new moongoose.Schema({
    name:String,
    email:String
 });
 module.exports= mongoose.modeel('User', userSchema);