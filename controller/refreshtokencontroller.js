const user=require('../model/user');
const jwt=require('jsonwebtoken');
const handlerefreshtoken=async (req,res)=>{
    const cookies=req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshtoken=cookies.jwt;
    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});
    const founduser=await user.findOne({refreshToken:refreshtoken}).exec();



    if(!founduser){
        jwt.verify(
        refreshtoken,
         process.env.REFRESH_TOKEN_SECRET,
        async (err,decoded)=>{
          if(err)  return res.sendStatus(403);
         const hackeduser = await user.findById(decoded.id).exec();
          hackeduser.refreshToken=[];
          const result=await hackeduser.save();
          console.log(result);
        }
        )
        return res.sendStatus(403);
        }
        const newReftreshTokenarray=founduser.refreshToken.filter(rt=>rt!==refreshtoken);

   
    jwt.verify(
    refreshtoken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err,decoded)=>{

        if(err){
            founduser.refreshToken=[...newReftreshTokenarray];
            await founduser.save();
            return res.sendStatus(403);
        }

        if(founduser._id.toString() !== decoded.id){
            return res.sendStatus(403);
        }

        const accessToken=jwt.sign(
            {
                id: founduser._id,
                username: founduser.username
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'10m'}
        );

        const newrefreshToken=jwt.sign(
            { id: founduser._id },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        );

        founduser.refreshToken=[
            ...newReftreshTokenarray,
            newrefreshToken
        ];

     await user.updateOne(
    { _id: founduser._id },
    {
        $set:{
            refreshToken:[
                ...newReftreshTokenarray,
                newrefreshToken
            ]
        }
    }
);

        res.cookie('jwt',newrefreshToken,{
            httpOnly:true,
            maxAge:24*60*60*1000,
            secure:true,
            sameSite:'None'
        });

        return res.json({accessToken});
    }
)
}
module.exports={handlerefreshtoken};
