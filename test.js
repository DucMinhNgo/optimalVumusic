const express = require('express');
const app = express();
const port = 8090;
// var redis = require('redis')
// var client = redis.createClient();
var addRequestId = require('express-request-id')();
app.use(addRequestId);
var lisResponse;
// var redis = require('redis');
// var port = process.env.REDIS_PORT || 6379; 
// var host = process.env.REDIS_HOST || '127.0.0.1';
// module.exports = redis.createClient(port, host);

// client.on('connect', function() {
//     console.log('connected');
// });

let cats = ['Bob', 'Willy', 'Mini'];
console.log("arr: ", cats);
console.log(cats[0]);
cats.shift();
console.log("arr: ", cats);

app.get('/pushlist', (req, res) => {
    if (lisResponse == undefined) {
        lisResponse = [];
    }
    lisResponse.push(res);
});

app.get('/responsedata', (req, res) => {
    lisResponse[0].json({
        status: true
    });
    res.json({
        status: true
    })
});

app.listen(port, () => {
    console.log('app listening at http://localhost:', port);
});