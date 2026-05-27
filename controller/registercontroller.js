const user=require('../model/user');
const bcrypt=require('bcrypt');
const handlenewuser=async (req,res)=>{
    const {username,password} =req.body;
    if(!username||!password){
        return res.status(400).json({"message":"user,pwd are required"});
    }
    const duplicate=await user.findOne({username:username})
    if(duplicate){
        return res.status(409).json({"message":"username already taken"});
    }
    try{
      const hashedpwd=await bcrypt.hash(password,10);
      const result=await user.create({
        username,
        password:hashedpwd
      });
      console.log(result);
      res.status(201).json({'success':`nre user ${username} created`});
    }
    catch (err){
      res.status(500).json({"message":err.message});
    }
}
module.exports={handlenewuser};