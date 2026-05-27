const ratelimit=require('express-rate-limit');
const apilimiter=ratelimit({
    windowMs:15*60*1000,
    max:200,
    message:{
        message:"too many requests try again later"
    }
})
const authlimiter=ratelimit({
    windowMs:15*60*1000,
    max:16,
    message:{
        message:"too many login attempts try again later"
    }
})
const registerLimiter = ratelimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // only 5 accounts per IP per hour
    message: "Too many accounts created from this IP"
});
module.exports={
    apilimiter,
    authlimiter,
    registerLimiter
}