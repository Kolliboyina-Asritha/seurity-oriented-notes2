const user=require('../model/user');
const handlelogout=async (req,res)=>{
    const cookies=req.cookies;
    if(!cookies?.jwt){
        return res.sendStatus(
            204);
    }
    const refreshtoken = cookies.jwt;
 const founduser = await user.findOne({
        refreshToken: { $in: [refreshtoken] }
    }).exec();
    if(!founduser){
        res.clearCookie('jwt',{httpOnly:true,secure:true,sameSite:'None'});
        return res.sendStatus(204);
    }
    founduser.refreshToken=founduser.refreshToken.filter(rt=>rt!==refreshtoken);
    const result=await founduser.save();
    console.log(result);
    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});
    res.sendStatus(204);
}
module.exports={handlelogout};
