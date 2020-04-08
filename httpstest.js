var express = require('express');
const https = require('https')
const app = express()
const fs = require('fs')

app.get('/', (req, res) => {
  res.send('Hello HTTPS!')
})

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(port=8092,host="0.0.0.0", () => {
  console.log('Listening...')
})