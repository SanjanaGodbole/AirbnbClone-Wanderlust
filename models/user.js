
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


//You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, 
//the hashed password and the salt value.
const userSchema=new Schema({
    email:{
        //A configuration object describing the field
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose);
//module.export=mongoose.model("User",userSchema)
const User = mongoose.model('User', userSchema);
module.exports = User;
