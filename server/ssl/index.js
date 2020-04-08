const express = require('express')
const fs = require('fs') 
const https = require('https')
const path = require('path')

const app = express()
const directoryToServer = 'client'
const port = 8092

app.use('/', express.static(path.join(__dirname__, '..', directoryToServer)))

const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname__, 'ssl', 'server.crt')),
    key: fs.readFileSync(path.join(__dirname__, 'ssl', 'server.key'))
}
https.createServer(httpsOptions, app)
    .listen(port, function () {
        console.log('port: ', port)
    })