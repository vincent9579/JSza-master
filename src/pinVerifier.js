const RSA = require('node-bignumber');

class PinVerifier {
  constructor(id, password) {
    this.id = id;
    this.password = password;
  }

  getRSACrypto(json) {
    const rsa = new RSA.Key();
    const chr = String.fromCharCode;
    const sessionKey = json.sessionKey;
    const message =
      sessionKey + chr(this.id.length) +
      this.id + chr(this.password.length) + this.password);
    rsa.setPublic(json.nvalue, json.evalue);
    const credentials = rsa.encrypt(message).toString('hex');
    const keyname = json.keynm;
    return { keyname, credentials, message };
  }
}


module.exports = PinVerifier;
