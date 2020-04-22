// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').load()
// }

var express = require('express');
var cors = require('cors');
var app = express();


app.use(cors());
// var db = require('./db');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var configDB = require('./config/database');
mongoose.connect(configDB.url);
require('./config/passport')(passport);
/*
* config size of image
*/
// app.use(bodyParser.json({ limit: '50mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'anystringoftext',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.static('public'));
/*
* REDESIGN PAYMENT
*/
// app.use(
//   express.json({
//     // We need the raw body to verify webhook signatures.
//     // Let's compute it only when hitting the Stripe webhook endpoint.
//     verify: function(req, res, buf) {
//       if (req.originalUrl.startsWith("/webhook")) {
//         req.rawBody = buf.toString();
//       }
//     }
//   })
// );
/*
* END REDESIGN
*/
//public image repository
// app.use(express.static('src/public'));
// app.use('/images', express.static(__dirname + '/src/public/uploads'));

app.post('/example', (req, res) => {
  res.send(req.body);
});
app.get('/testexample', (req, res) => {
  res.render('testform.ejs');
});

// public image
app.use('/images', express.static(__dirname + '/public/uploads'));
// end public image
// public music
app.use('/musics', express.static(__dirname + '/public/musics'));
app.get('/getmusics', function (req, res) {
  express.static(__dirname + '/public/musics')
})
// end public music

global.__root = __dirname + '/';

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});
require('./app/routes/defaultRouter')(app);
require('./app/routes.js')(app, passport);
require('./app/routes/userLocal')(app);
require('./app/routes/paymentRouter')(app);
require('./app/routes/imageRouter')(app);
require('./app/routes/musicRouter')(app);
require('./app/routes/verifyEmail')(app);
require('./app/routes/mockRouter')(app);
require('./app/routes/paypalRouter')(app);
require('./app/routes/albumMusicRouter')(app);
var UserController = require(__root + 'app/routes/UserRouter');
app.use('/api/users', UserController);

var AuthController = require(__root + 'auth/AuthRouter');
app.use('/api/auth', AuthController);
var addRequestId = require('express-request-id')();
app.use(addRequestId);

var schedule = require('node-schedule');
var today = new Date();
// CHECK EXPIRED EVERYDAY
var j = schedule.scheduleJob({ hour: 24 }, function () {
  // console.log('Check expired!');
  var User = require('./app/models/user');
  User.find({}, function (err, users) {
    // console.log(users);
    for (index in users) {
      // console.log(users[index]);
      expirationDate = users[index].get('expiration');
      var oneDay = 1000 * 60 * 60 * 24;
      // console.log((expirationDate- today) / oneDay);
      var checkTime = (expirationDate - today) / oneDay;
      // console.log(checkTime);
      if (checkTime > 0) {
        console.log('account active');

      } else {
        console.log('expired');
        id = users[index].get('_id');
        User.findOne({ _id: id }, function (error, doc) {
          if (doc) {
            doc.status = 0;
            doc.save();
            console.log('status: ', doc.status);
          } else {
            console.log('error', error);
          }
        });
        // users.save();
      }
    }
    // users.save();
  });
});

// console.log(process.env.key);
module.exports = app;