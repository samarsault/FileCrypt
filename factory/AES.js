//
// OpenSSL
//
const crypto = require("crypto");

// AES-128 in CBC mode
const algorithm = "aes-128-cbc";

const encrypt = (buff) => {
  // Initialization vector
  const iv = crypto.randomBytes(16);
  // One time session key
  const secretKey = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(buff), cipher.final()]);

  return {
    iv,
    secretKey,
    content: encrypted,
  };
};

//
// enc contains the iv (initialization vector), secret key, 
// and encrypted message
//
const decrypt = (enc) => {
  const decipher = crypto.createDecipheriv(algorithm, enc.secretKey, enc.iv);

  return Buffer.concat([
    decipher.update(enc.content),
    decipher.final(),
  ]);
};

module.exports = {
  encrypt,
  decrypt,
};
