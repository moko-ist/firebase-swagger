const functions = require('firebase-functions');
const express   = require('express');
const requestIp = require('request-ip');
const auth      = require('basic-auth');
const fs        = require('fs');

exports.designWithAuth = functions.https.onRequest((req, res) => {
  const basicAuthUser = functions.config().basicauth.user;
  const basicAuthPass = functions.config().basicauth.pass;

  const credentials = auth(req)
  if (!credentials || credentials.name !== basicAuthUser || credentials.pass !== basicAuthPass) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    return res.end('access denied');
  }

  const query = req.query
  if (!query) {
    return res.status(404).send('Need to specify file name');
  }

  const file = query.file
  if (!file) {
    return res.status(404).send('Need to specify file name');
  }
  const filePath = `designs/${file}`

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Wrong file path');
  }

  const json = fs.readFileSync(filePath).toString();
  return res.status(200).send(json);
});
