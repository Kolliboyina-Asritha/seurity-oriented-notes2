require('dotenv').config();
const jwt=require('jsonwebtoken');
const verifyjwt=(req,res,next)=>{
    console.log('verifyjwt triggered');
    const authHeader=req.headers.authorization||req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer')){
        return res.sendStatus(401);
    }
    const token=authHeader.split(' ')[1];
    console.log('Access token:',token);
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            console.log('jwt verification error:',err.message);
            return res.sendStatus(403);
        }
        req.user = {
                id: decoded.id,
                username: decoded.username
            };
        console.log('Token Verified, user:',req.user);
        next();
    })
}
module.exports=verifyjwt;