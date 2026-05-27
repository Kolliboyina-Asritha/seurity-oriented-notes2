
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userschema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    /*failedLoginAttempts: {
    type: Number,
    default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },*/
    refreshToken:[String]

})
module.exports=mongoose.model('User',userschema);