require('dotenv').config();
const crypto=require('crypto');
const algorithm='aes-256-cbc';
const secretKey=process.env.ENCRYPTION_KEY;
const decrypt=(encryptedData,iv)=>{
    const decipher=crypto.createDecipheriv(
        algorithm,
        Buffer.from(secretKey,'hex'),
        Buffer.from(iv,'hex')
    );
    let decrypted=decipher.update(encryptedData,'hex','utf8');
    decrypted+=decipher.final('utf8');
    return decrypted;
}
module.exports=decrypt;