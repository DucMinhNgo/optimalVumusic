var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../app/models/user');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config/token'); // get config file
/**
 * cofigure verifyEmail
 */
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
router.post('/resetpassword', function (req, res) {
  const { codeverify, email, newpassword } = req.body;

  if (codeverify == myCache.get(email)) {
    User.findOne({ email: email }, function (err, user) {
      if (user) {
        if (user.provider != 'local') {
          res.json({
            status: false,
            msg: 'your account is signed up with google or facebook account'
          })
        } else {
          var hashedPassword = bcrypt.hashSync(newpassword, 8);
          user.password = hashedPassword;
          user.save();
          /*
          * clear cache
          */
          myCache.del(email);
          res.json({
            status: true,
            msg: 'reset password is successfully'
          })
        }

      } else {
        res.status(200).send({
          status: false,
          msg: 'account is not existed'

        });

      }
    })
  } else {
    res.json({
      status: false,
      msg: 'verify code is wrong'
    })
  }
});

router.post('/music/share', function (req, res) {
  const { idMusic, email } = req.body;
  var id = req.cookies['idUser'];
  if (id) {
    console.log("id: ", id);
  } else {
    console.log("id not found");
  }
  id = "5e7d9f87c1ff366aad8909b0";
  User.findOne({ _id: id }, function (err, doc) {
    if (err) {
      res.json({
        status: false,
        msg: 'error'
      })
    }
    if (doc) {
      var arr = doc.listMusic;
      lenArr = arr.length;
      let flag = false;
      for (let i = 0; i < lenArr; i++) {
        if (arr[i].idMusic == idMusic) {
          flag = true
          let linkMusic = "https://viws.ddns.net/predictor/admin/musics/" + arr[i].link;
          var mailOptions = {
            from: 'vimusicapp@gmail.com',
            to: email,
            subject: 'Share music',
            text: linkMusic
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
                email: email,
                msg: "please get link of music in your email"
              });
            }
          });
        }
      }
      // idMusic is not found
      if (flag == false) {
        res.json({
          status: false,
          msg: 'idMusic is not found'
        })

      }

    } else {
      res.json({
        status: false,
        msg: 'false'
      })
    }
  });

});
var _before_html = '<div>'
_before_html += '<p style="margin:0px;font-size:14px;font-family:Helvetica,Arial,Verdana sans-serif">';
_before_html += '</p><table width="560" border="0" cellpadding="0" cellspacing="0">';
_before_html += '<tbody><tr>';
_before_html += '<td align="center" style="color:#32454c;font-family:Helvetica,Arial,Verdana sans-serif">';
_before_html += '<p style="font-size:42px;line-height:1.25;margin:0"><b>Vimusic website needs you.</b></p>';
_before_html += '<p style="font-size:14px;line-height:1.71;margin:20px 0 40px 0">We just want to make sure you’re still want to create your account</p>';
_before_html += '</td>';
_before_html += '</tr>';

_before_html += '<tr>';
_before_html += '<td align="center" style="color:#ff5c62;font-size:14px;line-height:20px">';



// var _content_html = '<a href="#"><strong>Verify Code:  codeverify </strong></a>';

var _after_html = '</td>';
_after_html += '</tr>';
_after_html += '</tbody></table>';
_after_html += '<table border="0" cellpadding="0" cellspacing="0" width="560">';
_after_html += '<tbody><tr>';
_after_html += '<td style="padding:40px 0 0 0">';

_after_html += '<img src="https://ci4.googleusercontent.com/proxy/Mtsdtb21R0ELNR91tv3YDffnDVF_LNVxq7SdB7G0P1TU83ZL2entGJh6a9Qh-RdprLJ0rtYqpOP5GpbVzhSFw9QG1il9zUMI4KTUBjOQiVRxull205AxwNla9txEXbJJ2yWXwLQ_Kvlghajm=s0-d-e1-ft#https://cdn.000webhost.com/000webhost/email/app-removal-notification-email-header-img.png" alt="Create an app header image" class="CToWUd a6T" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 642px; top: 732.6px;"><div id=":o5" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Tải xuống tệp đính kèm " data-tooltip-class="a1V" data-tooltip="Tải xuống"><div class="aSK J-J5-Ji aYr"></div></div></div>';

_after_html += '</td>';
_after_html += '</tr>';
_after_html += '</tbody></table>';
_after_html += '<table border="0" cellpadding="0" cellspacing="0" width="540">';
_after_html += '<tbody><tr>';
_after_html += '<td align="center" style="color:#32454c;font-family:Helvetica,Arial,Verdana sans-serif;padding-top:40px">';
_after_html += '<p style="font-size:24px;line-height:1.33;margin:0"><b>Please share vimusic website to all your friend.</b></p>';
_after_html += '<p style="font-size:14px;line-height:1.71;margin:20px 0 40px 0">We will create new music use AI technology and listen your music</p>';
_after_html += '</td>';
_after_html += '</tr>';

_after_html += '<tr>';
_after_html += '<td align="center" style="color:#ff5c62;font-size:14px;line-height:20px">';

// _after_html += '<a href="#"><strong>Upgrade To Premium</strong></a>';
_after_html += '<a href="#" rel="noopener noreferrer" style="font-family:Verdana,Sans-Serif;background-color:#ff5c62;border-radius:3px;color:#ffffff;display:inline-block;font-size:14px;line-height:50px;text-align:center;text-decoration:none;width:220px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://mailer.000webhost.com/186422140/32b1e58f5139bce92d31ad507e90adf5/3689?e%3DeNrLKCkpKLbS1y8vL9czMDAoT03KyC8u0UvOz9VPLkjMS83RzclPz8wDABfbDkA%253D%26s%3Da5bf546c9bd44bab9a965fd5c637d404c063d2651044086027787bf890227b28&amp;source=gmail&amp;ust=1586404941632000&amp;usg=AFQjCNF6DfDc-ugT-3W4FBBOVLFT3zXqQw"><strong>Upgrade To Premium</strong></a>';

_after_html += '</td>';
_after_html += '</tr>';
_after_html += '</tbody></table><p></p>';
_after_html += '</div>';

router.post('/verifyemail', function (req, res) {
  const { email } = req.body;
  var codeverify = Math.floor(Math.random() * 100000).toString();
  console.log(codeverify);
  success = myCache.set(email, codeverify, 10000);
  // var _content_html = '<a href="#"><strong>Verify Code:  ' + codeverify  + '</strong></a>';
  var _content_html = '<a href="#" rel="noopener noreferrer" style="font-family:Verdana,Sans-Serif;background-color:#ff5c62;border-radius:3px;color:#ffffff;display:inline-block;font-size:14px;line-height:50px;text-align:center;text-decoration:none;width:220px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://mailer.000webhost.com/186422140/32b1e58f5139bce92d31ad507e90adf5/3689?e%3DeNrLKCkpKLbS1y8vL9czMDAoT03KyC8u0UvOz9VPLkjMS83RzclPz8wDABfbDkA%253D%26s%3Da5bf546c9bd44bab9a965fd5c637d404c063d2651044086027787bf890227b28&amp;source=gmail&amp;ust=1586404941632000&amp;usg=AFQjCNF6DfDc-ugT-3W4FBBOVLFT3zXqQw"><strong>Verify Code: </strong></a>';
  _content_html += '<p style="font-size:42px;line-height:1.25;margin:0"><b>' + codeverify + '</b></p>';
  var _html = _before_html + _content_html + _after_html;
  // _before_html =  _content_html;
  // _before_html += _after_html;
  var mailOptions = {
    from: 'vimusicapp@gmail.com',
    to: email,
    subject: 'Sending verify code from vimusic',
    text: codeverify,
    html: _html
  };
  /*
  * Check account is exists
  */
  // User.findOne({ email: email.toLowerCase() }, function (err, user) {
  //   if (err) return res.send({
  //     status: false,
  //     result: {
  //             message: 'Error on the server.'
  //           }
  // });
  //   if (user) {
  //     res.json({
  //       status:false,
  //       msg: 'your account is exists'
  //     })
  //   } else {
  //     transporter.sendMail(mailOptions, function(error, info){
  //       if (error) {
  //         res.json({
  //             status: false,
  //             msg: 'error'
  //         })
  //       } else {
  //         res.json({
  //           status: true,
  //           email: email,
  //           msg: "please get code verify in your email"
  //       });
  //       }
  //     });
  //   }
  // });
  /*
 * End Check account is exists
 */

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({
        status: false,
        msg: 'error'
      })
    } else {
      res.json({
        status: true,
        email: email,
        msg: "please get code verify in your email"
      });
    }
  });
});

router.post('/login', function (req, res) {
  const { email } = req.body;
  User.findOne({ email: email.toLowerCase() }, function (err, user) {
    if (err) return res.send({
      status: false,
      result: {
        message: 'Error on the server.'
      }
    });
    if (!user) return res.send({
      status: false,
      result: {
        message: 'No user found.'
      }
    });
    if (user.provider != 'local') {
      res.json({
        status: false,
        msg: 'please login local account',
        auth: false,
        token: null
      })

    } else {
      // check if the password is valid
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.send({
        msg: "login process is failed",
        status: false,
        auth: false,
        token: null
      });

      // if user is found and password is valid
      // create a token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
      res.cookie('idUser', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
      // return the information including token as JSON
      res.status(200).send({
        status: true,
        auth: true,
        token: token,
        result: [{
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
          provider: user.provider,
          message: "login process is successful"
        }]
      });
    }
  });
});

router.get('/logout', function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', function (req, res) {
  const { codeverify, email, firstName, lastName, userName } = req.body;
  console.log("codeverify: ", codeverify);
  console.log("cache: ", myCache.get(email));
  if (codeverify == myCache.get(email) && codeverify != undefined) {
    /*
    * clear cache
    */
    myCache.del(email);
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.findOne({ email: email.toLowerCase() }, function (err, doc) {
      if (!doc) {
        console.log("----------------------create---------------------------------");
        User.create({
          firstName: firstName,
          lastName: lastName,
          userName: userName,
          email: email.toLowerCase(),
          password: hashedPassword,
          provider: 'local',
        },
          function (err, user) {
            if (err) return res.send({
              status: false,
              result: { message: "There was a problem registering the user`." }
            });

            // if user is registered without errors
            // create a token
            var token = jwt.sign({ id: user._id }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });
            res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
            res.status(200).send({
              auth: true,
              status: true,
              result: [{
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email: email.toLowerCase(),
                provider: 'local',
                message: "sucessfully"
              }]
            });
          });
      } else {
        console.log("----------------------exists---------------------------------");
        res.status(200).send({
          status: false,
          result:
          {
            message: 'account is existed'
          }
        });
      };
    });
  } else {
    res.json({
      status: false,
      msg: 'please get verifycode from your email'
    })
  }
});

router.get('/me', VerifyToken, function (req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });

});

router.get('/test', VerifyToken, function (req, res, next) {
  res.status(200).json({
    result: {
      message: 'verifyToken'
    }
  })
})

module.exports = router;