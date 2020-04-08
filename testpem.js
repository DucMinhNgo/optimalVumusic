const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./ssl/privkey.pem'),
  cert: fs.readFileSync('./ssl/fullchain.pem')
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8091);

// var https = require('https');

// https.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.write('Hello World!');
//   res.end();
// }).listen(8091);