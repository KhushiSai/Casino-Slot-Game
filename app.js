
const app=require('express')();
const http=require('http').Server(app);
const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://Shiv:shiv@cluster1.eizygaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1")
 const User=require('./models/userModel')
http.listen(5000,function(){
    console.log('Server is running');
});