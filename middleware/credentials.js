const allowedOrigins = require('../config/allowedOrigins');
const credentials = (req, res, next) => {
    console.log(`🟡 Credentials Middleware → Origin: ${req.headers.origin}`);
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        console.log(`✅ Origin Passed CORS: ${origin}`);
        res.header('Access-Control-Allow-Credentials', true);
    } else {
        console.log(`🔴 Origin Blocked: ${origin}`);
    }
    next();
};
module.exports = credentials;
