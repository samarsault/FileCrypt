const fs = require("fs");
const zlib = require("zlib");

const AES = require("./AES");
const RSA = require("./RSA");

//
// Encrypt file using PGP like system
//
function encrypt(fileName, senderPrivateKey, receiverPublicKey) {
  const buffer = fs.readFileSync(fileName);
  // Signature buffer
  const s = RSA.sign(buffer, senderPrivateKey);

  // Compress signature and message combination
  const xs = zlib.deflateSync(Buffer.concat([s, buffer]));
  const enc = AES.encrypt(xs);
  const sessionKey = RSA.encrypt(enc.secretKey, receiverPublicKey);

  return Buffer.concat([enc.iv, sessionKey, enc.content]);
}

//
// Decrypt file using PGP like system
//
function decrypt(fileName, receiverPrivateKey, senderPublicKey) {
  const buf = fs.readFileSync(fileName);

  const IV = buf.slice(0, 16);
  const S = buf.slice(16, 16 + 256);
  const Y = buf.slice(16 + 256);

  const Ks = RSA.decrypt(S, receiverPrivateKey);

  const X = AES.decrypt({
    content: Y,
    iv: IV,
    secretKey: Ks,
  });

  const Xp = zlib.unzipSync(X);
  const signature = Xp.slice(0, 256);
  const message = Xp.slice(256);
  const isVerified = RSA.verify(signature, message, senderPublicKey);

  if (!isVerified) throw new Error("Cannot authenticate sender");

  return message;
}

module.exports = {
  encrypt,
  decrypt,
  keyGen: RSA.generateKeys,
};
