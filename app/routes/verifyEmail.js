
var nodemailer = require('nodemailer');
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vimusicapp@gmail.com',
        pass: 'Vimusic2020'
    }
});

module.exports = function (app) {

    app.get('/api/getidbrowser', function (req, res) {
        var uniqid = require('uniqid');
        res.json({
            status: true,
            data: uniqid
        })
    });
    app.get('/api/setsession', function (req, res) {
        success = myCache.set("myKey", 'Dustin', 10000);
        return res.status(200).json({ status: 'success' })
    });
    app.get('/api/getsession', function (req, res) {
        // var session = req.getSession();
        //check session
        value = myCache.get("myKey");
        if (value) {
            return res.status(200).json({ status: 'success', session: value });
        }
        return res.status(200).json({ status: 'error', session: 'No session' });

    });
    app.get('/api/delsession', function (req, res) {
        myCache.del("myKey");
        return res.json({ msg: 'delete is successfully' });
    });
    app.post('/api/checksession', function (req, res) {
        const { codeverify, email } = req.body;
        if (codeverify == myCache.get(email)) {
            res.json({
                status: true
            })
        } else {
            res.json({
                status: false
            })
        }
    });
    app.post('/api/verifyemail', function (req, res) {
        const { email } = req.body;
        var codeverify = Math.floor(Math.random() * 100000).toString();
        console.log(codeverify);
        success = myCache.set(email, codeverify, 10000);
        var mailOptions = {
            from: 'vimusicapp@gmail.com',
            to: email,
            subject: 'Sending verify code from vimusic',
            text: codeverify
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.json({
                    status: false,
                    msg: 'error'
                })
            } else {
                res.json({
                    status: true,
                    email: email
                });
            }
        });
    })
};