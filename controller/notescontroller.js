const notes=require('../model/notes');
const mongoose=require('mongoose');
const decrypt=require('../utils/decryption');
const encrypt = require('../utils/encryption');
const formatNote=require('../utils/formatnotes');
const getallnotes = async (req, res) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({ message: "unauthorized" });
            }
            const userId = req.user.id;
            const page=parseInt(req.query.page)||1;
            const limit=parseInt(req.query.limit)||10;
            const skip=(page-1)*limit;
            const allnotes = await notes.find({
                userid: userId
            }).sort({
                isPinned:-1,
                createdAt:-1
            }).skip(skip).limit(limit)
            .exec();
            const decryptedNotes=allnotes.map(formatNote);
            console.log(allnotes);
         return res.json(decryptedNotes);
            
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "server error" });
        }
    }
const createnewnotes=async (req,res)=>{
    const {title,content,tags,isPinned,isArchived}=req.body;
    if(!title||!content){
        return res.status(400).json({"message":"all fields are required"});
    }
    try{
        const {encryptedData,iv}=encrypt(content);
        const newnote=await notes.create({
            userid:req.user.id,
            title,
            encryptedContent:encryptedData,
            iv,
            tags,
            isPinned,
            isArchived
        });
      
           console.log(newnote);
            return res.json(formatNote(newnote));
     
    }
    catch (err){
       console.error(err);
        return res.status(500).json({
            "message": "server error"
        });
    }
}
const updatenote=async (req,res)=>{
    const {id}=req.params;
    const {title,content,tags,isPinned,isArchived}=req.body;
    if(!id){
        return res.status(400).json({"message":"id is required"});
    }
        if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({
        message:'invalid id'
    });
    }
    try{
        const foundnotes=await notes.findOne({
            _id:id,
            userid:req.user.id
        }).exec()
        if (!foundnotes) {
        return res.status(404).json({
            "message": "note not found"
         });
        }
        if(title){
            foundnotes.title=title
        }
        if(content){
            const {encryptedData,iv}=encrypt(content);
            foundnotes.encryptedContent=encryptedData;
            foundnotes.iv=iv;
        }
       
        if(Array.isArray(tags)){
            foundnotes.tags=tags;
        }
        if(typeof isPinned === "boolean"){
            foundnotes.isPinned=isPinned;
        }
        if (typeof isArchived === "boolean"){
            foundnotes.isArchived=isArchived;
        }
       const result=await foundnotes.save();
          return res.json(formatNote(foundnotes));
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ message: "server error" });
    }
}
const deletenote=async (req,res)=>{
    const {id}=req.params;
    if(!id){
        return res.status(400).json({"message":"id is required"});
    }
         if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({
        message:'invalid id'
    });
    }
    try{
    const foundnote=await notes.findOne({
        _id:id,
        userid:req.user.id
    }).exec();
    if(!foundnote){
        return res.status(404).json({
            "message": "note not found"
         })
    }
    const result=await notes.deleteOne({
        _id:id,
        userid:req.user.id
    })
    console.log(result);
    return res.json({ message: "note deleted successfully" });
    
  }
   catch (err){
        console.error(err);
        return res.status(500).json({ message: "server error" });
    }
}

const getnote=async (req,res)=>{
    const {id}=req.params;
    if(!id){
       return res.status(400).json({"message":"id is required"});  
    }
         if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({
        message:'invalid id'
    });
    }
    try{
        const foundnote=await notes.findOne({
        _id:id,
        userid:req.user.id
     }).exec();
      if(!foundnote){
        return res.status(404).json({
            "message": "note not found"
         }); 
    }
    
    console.log(foundnote);
   return res.json(formatNote(foundnote));
}
    catch (err){
        console.error(err);
        return res.status(500).json({ message: "server error" });
    }
}
const getnotebytag=async (req,res)=>{
    const {tag}=req.params;
    if(!tag){
        return res.status(400).json({"message":"tag is required"});
    }
    try{
        const foundnotes=await notes.find({
            userid:req.user.id,
            tags:tag
        }).exec();
       
         return res.json(foundnotes.map(formatNote));
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ message: "server error" });
    }
}
const getnotebymultag=async (req,res)=>{
     const {tag}=req.params;
    if(!tag){
        return res.status(400).json({"message":"tag is required"});
    }
      const tags=tag.split(',');
    try{
        const foundnotes=await notes.find({
            userid:req.user.id,
            tags:{
                $in:tags
            }
        }).exec();
        if(foundnotes.length===0){
           return res.status(404).json({
            "message": "note not found"
         });  
        }
        return res.json(foundnotes.map(formatNote));
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ message: "server error" });
    }
}
const getpinnednotes=async (req,res)=>{
    try{
        const foundnotes=await notes.find({
            userid:req.user.id,
            isPinned:true
        }).exec();
       
            return res.json(foundnotes.map(formatNote));
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ message: "server error" });
    }
}
const getarchivednotes=async (req,res)=>{
    try{
        const foundnotes=await notes.find({
            userid:req.user.id,
            isArchived:true
        }).exec();
       
           return res.json(foundnotes.map(formatNote));
    
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ message: "server error" });
    }
}
const searchnotes=async(req,res)=>{
    const {title}=req.query;

    if(!title){
        return res.status(400).json({
            message:"title query is required"
        });
    }

    try{
        const foundnotes=await notes.find({
            userid:req.user.id,
            title:{
                $regex:title,
                $options:"i"
            }
        }).exec();

        /*if(foundnotes.length===0){
            return res.status(404).json({
                message:"no notes found"
            });
        }*/

          return res.json(foundnotes.map(formatNote));

    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            message:"server error"
        });
    }
}
module.exports={
    getallnotes,
    createnewnotes,
    updatenote,
    deletenote,
    getnote,
    getnotebytag,
    getnotebymultag,
    getpinnednotes,
    getarchivednotes,
    searchnotes
}

