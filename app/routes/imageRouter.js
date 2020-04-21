const multer = require('multer');
const path = require('path');
//using to save list of nameImage when multiple upload
var nameImg = [];
//using to save list of new name when encode name from image
var newNameImg = [];
var User = require('../models/user');
module.exports = app => {
  app.get('/api/image', function (req, res) {
    var fulltime = new Date();
    res.json({
      result: {
        time: fulltime,
        day: fulltime.getDay(),
        month: fulltime.getMonth(),
        year: fulltime.getYear()
      }
    })
  })
  //---route upload file
  app.get('/indeximage', (req, res) => res.render('testimage'));
  // Set The Storage Engine
  const storage = multer.diskStorage({
    destination: '../myapp/public/uploads/',
    filename: function (req, file, cb) {
      var newName = Date.now() + path.extname(file.originalname);
      cb(null, newName);
      nameImg.push(file.originalname);
      newNameImg.push(newName);

    }
  });
  // Init Upload
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  }).array('myImage', 100);
  // Check File Type
  function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      let imageName = file.originalname;
      //add new image (public/uploads);
      //   console.log("name: " + imageName);
      return cb(null, true);

    } else {
      cb('Error: Images Only!');
    }
  }
  app.get('/api/profile', function (req, res) {
    var id = req.cookies['idUser'];
    if (id) {
      // return res.send({
      // 	token: token,
      // 	idUser: idUser
      // });
      console.log("id: ", id);
    } else {
      console.log("id not found")
    }
    id = "5e68828e1a301f125fb94c50"
    // const id = req.params.id;
    User.findOne({ _id: id }, function (err, doc) {
      if (doc) {
        res.json({
          status: true,
          result: doc.listProfile
        })

      } else {
        res.json({
          status: false,
          result: 'id is not found'
        });
      }
    })
  });
  app.get('/api/avatar', function (req, res) {
    var id = req.cookies['idUser'];
    if (id) {
      // return res.send({
      // 	token: token,
      // 	idUser: idUser
      // });
      console.log("id: ", id);
    } else {
      console.log("id not found")
    }
    id = "5e68828e1a301f125fb94c50"
    User.findOne({ _id: id }, function (err, doc) {
      if (doc) {
        res.json({
          status: true,
          avatar: doc.picture
        })
      } else {
        res.json({
          status: false,
          result: 'id is not found'
        });
      }
    });
  });
  app.post('/api/profile', function (req, res) {
    newNameImg = [];
    nameImg = [];
    listResponse = [];
    // console.log(req.formData);
    var id = req.cookies['idUser'];
    if (id) {
      // return res.send({
      // 	token: token,
      // 	idUser: idUser
      // });
      console.log("id: ", id);
    } else {
      console.log("id not found")
    }
    id = "5e68828e1a301f125fb94c50"
    upload(req, res, (err) => {
      // console.log('req: ',req.body);
      if (err) {
        res.status(404).json({
          status: false,
          msg: err
        });
      } else {
        listResponse = [];
        if (nameImg.length == 0) {
          User.findOne({ _id: id }, function (err, doc) {
            if (doc) {
              arr = [];
              arr.push({
                statusText: req.body.statusText,
                listImage: [],
                createDate: Date.now().toString()
              });
              doc.listProfile = arr;
              doc.save();
              res.json({
                status: true,
                msg: 'no file upload',
                statusText: req.body.statusText,
                listImage: listResponse
              })

            } else {
              res.json({
                status: false,
                result: 'id is not found'
              });
            }
          });
        } else {
          //  if upload image is successful and update avatar
          var { avatar } = req.body;
          console.log("avatar: ", avatar);
          if (avatar) {
            // nameImg[0]
            User.findOne({ _id: id }, function (err, doc) {
              if (doc) {
                // use when add new field to old data
                doc.picture = "";
                doc.save();
                doc.picture = newNameImg[0];
                doc.save();
                res.json({
                  status: true,
                  msg: "add avatar is successful",
                  result: doc.picture
                });
              } else {
                res.json({
                  status: false,
                  result: 'id is not found'
                });
              }
            });

          } else {
            for (let i = 0; i < nameImg.length; i++) {
              console.log('nameImg', newNameImg[i]);
              listResponse.push({
                filename: newNameImg[i]
              })
              if (listResponse.length == nameImg.length) {
                User.findOne({ _id: id }, function (err, doc) {
                  if (doc) {
                    arr = [];
                    arr.push({
                      statusText: req.body.statusText,
                      listImage: listResponse,
                      createDate: Date.now().toString()
                    });
                    doc.listProfile = [];
                    doc.listProfile = arr;
                    doc.save();
                    res.json({
                      status: true,
                      statusText: req.body.statusText,
                      msg: 'upload is successfully',
                      listImage: listResponse
                    });


                  } else {
                    res.json({
                      status: false,
                      result: 'id is not found'
                    });
                  }
                });
              }
            }
          }
        }
        //   res.json('successfullly')
      }
    });
  });
};
