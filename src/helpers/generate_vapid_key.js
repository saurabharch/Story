var webPush = require("web-push");

const vapidkeys = webPush.generateVAPIDKeys();

console.log(`Public Key:  ${vapidkeys.publicKey}`);
console.log(`Private Key: ${vapidkeys.privateKey}`);