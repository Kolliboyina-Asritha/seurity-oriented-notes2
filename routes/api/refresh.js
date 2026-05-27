
const express=require('express');
const router=express.Router();
const refreshcontroller=require('../../controller/refreshtokencontroller');
router.get('/',refreshcontroller.handlerefreshtoken);
module.exports=router;