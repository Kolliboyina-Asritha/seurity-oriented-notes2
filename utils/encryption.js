require('dotenv').config();
const crypto=require('crypto');
const algorithm='aes-256-cbc';
const secretKey=process.env.ENCRYPTION_KEY;
const encrypt=(text)=>{
    const iv=crypto.randomBytes(16);
    const cipher=crypto.createCipheriv(algorithm,Buffer.from(secretKey,'hex'),iv);
    let encrypted=cipher.update(text,'utf8','hex');
    encrypted+=cipher.final('hex');
    return {
        iv:iv.toString('hex'),
        encryptedData:encrypted
    }
}
module.exports=encrypt;