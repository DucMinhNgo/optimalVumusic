// const https = require('https')
// const fs = require('fs')
var app = require('./app');
var port = process.env.PORT || 8092;

var server = app.listen(port, host = "0.0.0.0", function () {
  console.log('Express server listening on port ' + port);
});

// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(port,host="0.0.0.0", () => {
//   console.log('Listening...')
// })