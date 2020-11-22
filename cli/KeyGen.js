const fs = require("fs");
const RSA = require("../factory/RSA");

const label = process.argv[2];
if (!label) process.exit();

const keys = RSA.generateKeys();
const privateKeyFileName = `${label}.key`;
const publicKeyFileName = `${label}.pem`;
fs.writeFileSync(`${publicKeyFileName}`, keys.publicKey);
fs.writeFileSync(`${privateKeyFileName}`, keys.privateKey);

console.log(`Public Key: ${publicKeyFileName}`);
console.log(`Private Key: ${privateKeyFileName}`);
