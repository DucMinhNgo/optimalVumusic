const https = require('https');
var http = require('http');
const fs = require('fs');
var app = require('./app');
var port = process.env.PORT || 8092;

/*
* Add cluster in nodejs
*/
// var cluster = require('cluster');
// var numCPUs = require('os').cpus().length;
// if (cluster.isMaster) {
//   //Fork worker.
//   for (var i = 0; i< numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', function (worker, code, signal) {
//     console.log('worker' + worker.process.pid + 'died');
//   });
// } else {

// var server = app.listen(port, host="0.0.0.0", function() {
//   console.log('Express server listening on port ' + port);
// });

// https.createServer({
//   key: fs.readFileSync('./ssl/privkey.pem'),
//   cert: fs.readFileSync('./ssl/fullchain.pem')
// }, app).listen(port= 8091,host="0.0.0.0", () => {
//   console.log('Listening...')
// });

// http.createServer(app).listen(port= 8092,host="0.0.0.0", () => {
//   console.log('Listening...')
// });
// }


http.createServer(app).listen(port = 8092, host = "0.0.0.0", () => {
  console.log('Listening...')
});

console.log('Server running at https://viws.ddns.net:', port);
// var schedule = require('node-schedule');
// ADD PRE-CREATE MUSIC
// let data = {
//   name: "Dustin"
// }
// var m = schedule.scheduleJob({second:10}, function(){
//   // console.log('------------------array-------------------');
//   // /home/dustin/nodejs/myapp
//   console.log('APP_ROOT: ', __dirname);
//   var arr_genre = ['Rock', 'Pop', 'Classical'];
//   let len_arr_genre = arr_genre.length;
//   // for (let i = 0; i < len_arr_genre; i++) {
//   //   console.log(arr_genre[i]);
//   // }
//   const options = {
//     hostname: 'https://viws.ddns.net',
//     port: 80,
//     path: '/predictor/admin/chooseMusic',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   };
//   const req = https.request(options, res => {
//     console.log(`statusCode: ${res.statusCode}`)
//     res.on('data', d => {
//       process.stdout.write(d)
//     })
//   });
//   req.on('error', error => {
//     console.error(error)
//   });

//   req.write(data);
//   req.end();
// });