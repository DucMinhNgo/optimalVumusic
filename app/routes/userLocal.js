var User = require('../models/user')

module.exports = function (app) {
    app.get('/api/user', function (req, res) {
        // const id = req.params.id;
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
        // id = "5e68828e1a301f125fb94c50"
        User.find({ _id: id }, function (err, docs) {
            if (!err) {
                console.log(docs);
                res.json({
                    status: true,
                    result: docs,
                    url: "1583995677982.jpg"
                });

            } else {
                res.json({
                    status: false,
                    result: docs
                });
            }
        });
    });
    app.post('/api/address', function (req, res) {
        // const id = req.params.id;
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
        const { companyName, address, address2, city, country, zipCode, phone } = req.body;
        User.findOne({ _id: id }, function (err, doc) {
            if (doc) {
                doc.listAddress.push({
                    companyName: companyName ? companyName : '',
                    address: address ? address : '',
                    address2: address2 ? address2 : '',
                    city: city ? city : '',
                    country: country ? country : '',
                    zipCode: zipCode ? zipCode : '',
                    phone: phone ? phone : ''
                });
                doc.save();
                res.json({
                    status: true,
                    listAddress: doc.listAddress
                }

                )

            } else {
                res.json({
                    status: false,
                    result: 'id is not found'
                });
            }
        })
    });

    app.get('/api/address', function (req, res) {
        // const id = req.params.id;
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
                    listAddress: doc.listAddress
                }

                )

            } else {
                res.json({
                    status: false,
                    result: 'id is not found'
                });
            }
        })
    });
    app.post('/api/address/test', function (req, res) {
        // const id = req.params.id;
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
        // id = "5e68828e1a301f125fb94c50"
        const { index } = req.body;
        res.json({
            id: id,
            index: index
        })
    });
    app.put('/api/address', function (req, res) {
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
        // const {index} = req.query;
        const { index, companyName, address, address2, city, country, zipCode, phone } = req.body;
        dataUpdate = {
            companyName: companyName ? companyName : '',
            address: address ? address : '',
            address2: address2 ? address2 : '',
            city: city ? city : '',
            country: country ? country : '',
            zipCode: zipCode ? zipCode : '',
            phone: phone ? phone : ''
        }
        User.findOne({ _id: id }, function (err, doc) {
            if (doc) {
                len = doc.listAddress.length
                arr = doc.listAddress;

                if (index > -1 && index <= len) {
                    // arr.splice(index, 1);
                    arr[index] = dataUpdate;
                    doc.listAddress = [];
                    // console.log(arr);

                    doc.listAddress = arr;
                    // console.log(doc.listAddress[index]);
                    doc.save();
                    res.json({
                        status: true,
                        result: doc.listAddress
                    })
                    // console.log(arr);
                }
                else {
                    res.json({
                        status: false,
                        result: 'can not remove please check params'
                    });
                }
                // console.log(arr);
                // const _index = doc.listAddress.indexOf(5);
                // if (_index > -1) {
                //     doc.listAddress.splice(_index, index);
                //     doc.save();

                // }

            }
        });
    });
    app.delete('/api/address', function (req, res) {
        var id = req.cookies['idUser'];
        if (id) {
            console.log("id: ", id);
        } else {
            console.log("id not found")
        }
        id = "5e68828e1a301f125fb94c50"
        const { index } = req.query;
        console.log('index: ', index);
        User.findOne({ _id: id }, function (err, doc) {
            if (doc) {
                arr = doc.listAddress;
                // console.log(arr);
                len = doc.listAddress.length
                if (index > -1 && index <= len) {
                    arr.splice(index, 1);
                    doc.listAddress = arr;
                    doc.save();
                    res.json({
                        status: true,
                        result: doc.listAddress
                    })
                    // console.log(arr);
                }
                else {
                    res.json({
                        status: false,
                        result: 'can not remove please check params'
                    });
                }
                // console.log(arr);
                // const _index = doc.listAddress.indexOf(5);
                // if (_index > -1) {
                //     doc.listAddress.splice(_index, index);
                //     doc.save();

                // }

            }
        });
    });
    app.delete('/api/profile', function (req, res) {
        // const id = req.params.id;
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
        const { index } = req.query;
        User.findOne({ _id: id }, function (err, doc) {
            if (doc) {
                arr = doc.listProfile
                len = doc.listProfile.length
                if (index > -1 && index <= len) {
                    arr.splice(index, 1);
                    doc.listProfile = arr;
                    doc.save();
                    res.json({
                        status: true,
                        result: doc.listProfile
                    })
                    // console.log(arr);
                }
                else {
                    res.json({
                        status: false,
                        result: 'can not remove please check params'
                    });
                }

            }
        });
    });
    app.get('/api/account', function (req, res) {
        // const id = req.params.id;
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
                    result: JSON.parse(doc.moreInformation)
                })
            } else {
                res.json({
                    status: false,
                    result: 'id is not found'
                });
            }
        })
    })
    app.post('/api/account', function (req, res) {
        // const id = req.params.id;
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
        const { Email, PageUrl, firstName, lastName, contactEmail, contactEmail2, phone } = req.body;
        User.findOne({ _id: id }, function (err, doc) {
            if (doc) {
                doc.moreInformation = ''
                data = {
                    Email: Email,
                    PageUrl: PageUrl,
                    firstName: firstName,
                    lastName: lastName,
                    contactEmail: contactEmail,
                    contactEmail2: contactEmail2,
                    phone: phone
                }
                doc.moreInformation = JSON.stringify(data);
                doc.save();
                res.json({
                    status: true,
                    msg: 'true'
                })
            } else {
                res.json({
                    status: false,
                    result: 'id is not found'
                });
            }
        });

    });

    app.post('/api/notifycation', function (req, res) {
        // const id = req.params.id;
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
        const { likeBlog, commentBlog, followBlog, likeForum, commentForum, chatMessage } = req.body;
        User.findOne({ _id: id }, function (err, doc) {
            if (doc) {
                doc.notificationBlog = ''
                data = {
                    likeBlog: likeBlog,
                    commentBlog: commentBlog,
                    followBlog: followBlog,
                    likeForum: likeForum,
                    commentForum: commentForum,
                    chatMessage: chatMessage
                }
                doc.notificationBlog = JSON.stringify(data);
                doc.save();
                res.json({
                    status: true,
                    notificationBlog: JSON.parse(doc.notificationBlog)
                })

            } else {

            }
        });
    });

    app.get('/api/notifycation', function (req, res) {
        // const id = req.params.id;
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
                // doc.notificationBlog = ''
                if (!doc.notificationBlog) {
                    doc.notificationBlog = ''
                    data = {
                        likeBlog: false,
                        commentBlog: false,
                        followBlog: false,
                        likeForum: false,
                        commentForum: false,
                        chatMessage: false
                    }
                    doc.notificationBlog = JSON.stringify(data);
                    doc.save();
                }
                res.json({
                    status: true,
                    notificationBlog: JSON.parse(doc.notificationBlog)
                })

            } else {

            }
        });
    });
};
