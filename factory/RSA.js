const crypto = require("crypto");

// Generate RSA Key Pair
const generateKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });
  return { publicKey, privateKey };
};

// Encrypt message with RSA public key
const encrypt = (message, publicKey) => {
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(message)
  );
  return encrypted;
};

const decrypt = (encrypted, privateKey) =>
  crypto.privateDecrypt(
    {
      key: privateKey,
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    encrypted
  );

const sign = (data, privateKey) => {
  const signature = crypto.sign("sha256", Buffer.from(data), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  });
  return signature;
};

const verify = (signature, data, publicKey) => {
  return crypto.verify(
    "sha256",
    data,
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    },
    signature
  );
};

module.exports = {
  generateKeys,
  encrypt,
  decrypt,
  sign,
  verify,
};
