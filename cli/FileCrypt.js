#!/usr/bin/env node
const PGP = require("./index");

const method = process.argv[2];
const fileName = process.argv[3];
const keyLabel = process.argv[4];
const keyLabelTo = process.argv[5];

if (!method) {
  console.log("Error: No method specified");
  process.exit();
}

if (!fileName) {
  console.log("Error: No filename specified");
  process.exit();
}

if (!keyLabel) {
  console.log("Error: No key label specified");
  process.exit();
}

if (!fs.existsSync(fileName)) {
  console.log("Can't location file");
  process.exit();
}

function getKeys(label) {
  const privateKeyFileName = `${label}.key`;
  const publicKeyFileName = `${label}.pem`;

  if (!(fs.existsSync(privateKeyFileName) && fs.existsSync(publicKeyFileName)))
    return;

  const publicKey = fs.readFileSync(keyLabel + ".pem");
  const privateKey = fs.readFileSync(keyLabel + ".key");

  return {
    publicKey,
    privateKey,
  };
}

const senderKeys = getKeys(keyLabel);
const receiverKeys = getKeys(keyLabelTo);

if (method == "encrypt") {
  PGP.encrypt(fileName, senderKeys.privateKey, receiverKeys.privateKey);
} else {
  PGP.decrypt(fileName, receiverKeys.privateKey, senderKeys.publicKey);
}

fs.writeFileSync(fileName + ".enc", result);
