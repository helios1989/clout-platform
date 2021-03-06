const rp = require('request-promise');
const crypto = require("crypto");

function signHmacSha384(key, str) {
  let hmac = crypto.createHmac("sha384", key);
  let signed = hmac.update(str);
  return signed.digest("base64");
}

const privateKey = '2a45a131-6d42-492c-8a90-d2fb3b383db1';
const publicKey = '2936572d-a285-4194-aeac-bfb2be1c16fe';

module.exports.getIcoList = function (page = 0) {
  let body = {page: page};
  let sig = signHmacSha384(privateKey, JSON.stringify(body));
  let options = {
    uri: 'https://icobench.com/api/v1/icos/all',
    method: 'POST',
    headers: {
      'X-ICObench-Key': publicKey,
      'X-ICObench-Sig': sig
    },
    body: body,
    json: true
  };

  return rp(options);
};

module.exports.getIco = function (id) {
  let body = {};
  let sig = signHmacSha384(privateKey, JSON.stringify(body));
  let options = {
    uri: 'https://icobench.com/api/v1/ico/' + id,
    method: 'POST',
    headers: {
      'X-ICObench-Key': publicKey,
      'X-ICObench-Sig': sig
    },
    body: body,
    json: true
  };

  return rp(options);
};
