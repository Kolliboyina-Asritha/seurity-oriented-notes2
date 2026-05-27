const express=require('express');
const router=express.Router();
const notescontroller=require('../../controller/notescontroller');

router.get('/',notescontroller.getallnotes);
router.post('/',notescontroller.createnewnotes);
router.get('/pinned',notescontroller.getpinnednotes);
router.get('/archived',notescontroller.getarchivednotes);
router.get('/search/title',notescontroller.searchnotes);
router.get('/tag/:tag',notescontroller.getnotebytag);
router.get('/tags/:tag',notescontroller.getnotebymultag);
router.put('/:id',notescontroller.updatenote);
router.delete('/:id',notescontroller.deletenote);
router.get('/:id',notescontroller.getnote);


module.exports=router;