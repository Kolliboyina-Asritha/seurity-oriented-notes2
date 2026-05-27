
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const noteschema=new Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    encryptedContent:{
        type:String,
        required:true
    },
    iv:{
        type:String,
        default:null
    },
    tags:{
        type:[String],
        default:[]
    },
     isPinned:{
        type:Boolean,
        default:false
    },
    isArchived:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
module.exports=mongoose.model('Note',noteschema);