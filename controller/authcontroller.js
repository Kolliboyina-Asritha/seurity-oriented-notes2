const User=require('../model/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const handleLogin=async (req,res)=>{
    const cookies=req.cookies;
    const {username,password}=req.body;
    console.log("RAW BODY:", req.body);
    if(!username||!password) return res.status(400).json({'message':'username and password must required'});
    const founduser=await User.findOne({username});

    if(!founduser){
       return res.sendStatus(401); 
    }
    /* if (founduser.lockUntil && founduser.lockUntil > Date.now()) {
    return res.status(403).json({
        message: "Account locked. Try later."
    });
    }*/

    const match=await bcrypt.compare(password,founduser.password);
    if(match){
        const accessToken=jwt.sign(
            {  id: founduser._id,
                "username":founduser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'10m'}
        );
        const newrefreshToken=jwt.sign(
            { id: founduser._id },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        );
        let newrefreshtokenarray=
            !cookies?.jwt
            ? founduser.refreshToken
            :founduser.refreshToken.filter(rt=>rt!==cookies.jwt);
        
        if(cookies?.jwt) {
             //if there is ascenario that user logs in but never use rt and doesnot logout or in another case if
             //rt is stolen
             //if 1&2 scenes,reuse detection is needed to clear all rts when user logsin
             const refreshToken=cookies.jwt;
             const foundtoken = await User.findOne({
                refreshToken: refreshToken
             });
             if(!foundtoken){
                console.log('attempted refresh token reuse at login!')
                newrefreshtokenarray=[];
             }


            /*founduser.failedLoginAttempts = 0;
            founduser.lockUntil = null;
            */
            res.clearCookie('jwt',{httpOnly:true,sameSite:'Lax'});
    
        }

        founduser.refreshToken=[...newrefreshtokenarray,newrefreshToken];
        const result=await founduser.save();
        console.log(result);
        res.cookie('jwt',newrefreshToken,{
            httpOnly:true,
            maxAge:24*60*60*1000,
            secure:true,
            sameSite:'None'
        });
        res.json({accessToken});
    }
    else{
        /*founduser.failedLoginAttempts += 1;
        // lock after 5 attempts
        if (founduser.failedLoginAttempts >= 5) {
            founduser.lockUntil = Date.now() + 15 * 60 * 1000;
        }
        await founduser.save();
        return res.status(401).json({ message: "Invalid credentials" });
            res.sendStatus(401);
        }*/
       return res.sendStatus(401);
}}
module.exports={handleLogin};
