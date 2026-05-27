const express=require('express');
const router=express.Router();
const authcontroller=require('../../controller/authcontroller');
router.post('/',authcontroller.handleLogin);
module.exports=router;