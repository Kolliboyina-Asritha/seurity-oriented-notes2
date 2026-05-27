const decrypt=require('./decryption');
const notes=require('../model/notes');
const formatNote=(note)=>{
    return {
        _id:note._id,
        title:note.title,
        content:decrypt(note.encryptedContent,note.iv),
        tags:note.tags,
        isPinned:note.isPinned,
        isArchived:note.isArchived,
        createdAt:note.createdAt,
        updatedAt:note.updatedAt
    }
};
module.exports=formatNote;