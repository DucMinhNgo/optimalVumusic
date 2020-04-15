var User = require('../models/user');
module.exports = app => {
    app.get('/api/emptyalbum', (req, res) => {
        var id = req.cookies['idUser'];
            if (id) {
                console.log("id: ", id);
            } else {
                console.log("id not found")
            }
            console.log("id: ", id);
            id = "5e7d9bbc2fb3ca5c43912083";
        User.findOne({_id: id}, function (err, doc) {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                });
            }
            if (doc) {
                let arr = [];
                doc.listAlbum = arr;
                doc.save();
                res.json({
                    status: true,
                    result: doc.listAlbum
                })
            } else {
                res.json({
                    status: false,
                    msg: 'UserId is not found'
                })
            }
        })
    });
    app.delete('/api/removeMusicFromAlbum', (req, res) =>{
        const {idAlbum, idMusic} = req.query;
        var id = req.cookies['idUser'];
        if (id) {
            console.log("id: ", id);
        } else {
            console.log("id not found")
        }
        console.log("id: ", id);
        id = "5e7d9bbc2fb3ca5c43912083";
        // console.log('idAlbum: ', idAlbum);
        // console.log('idMusic: ', idMusic);
        User.findOne({_id: id}, function (err, doc) {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                });
            }
            if (doc) {
                let arr = doc.listAlbum;
                let lenArr = arr.length;
                let tempData = [];
                let flat = false;
                for (let i = 0; i < lenArr; i++) {
                    // console.log(arr[i]);
                    if (arr[i].idAlbum == idAlbum) {
                        let arrListMusicInAlbum = arr[i].listMusic;
                        let lenArrListMusicInAlbum = arrListMusicInAlbum.length;
                        for (let j = 0; j < lenArrListMusicInAlbum; j++) {
                            if (arrListMusicInAlbum[j].idMusic == idMusic){
                                // console.log(true);
                                flat = true;
                            } else {
                                tempData.push(arrListMusicInAlbum[j]);
                            }
                        }
                        arr[i].listMusic = [];
                        arr[i].listMusic = tempData;
                    }
                }
                if (flat == true) {
                    // console.log(arr);
                    doc.listAlbum = [];
                    doc.listAlbum = arr;
                    doc.save();
                    res.json({
                        status: true,
                        msg: 'delete is sucessful'
                    })
                } else {
                    res.json({
                        status: false,
                        msg: 'please check idAlbum or idMusic'
                    })
                }
            } else {
                res.json({
                    status: false,
                    msg: 'UserId is not found'
                })
            }
        });
    });
    app.post('/api/addMusicToAlbum', (req, res) =>{
        const {idAlbum, idMusic} = req.body;
        var id = req.cookies['idUser'];
        if (id) {
            console.log("id: ", id);
        } else {
            console.log("id not found")
        }
        console.log("id: ", id);
        id = "5e7d9bbc2fb3ca5c43912083";
        User.findOne({_id: id}, function (err, doc) {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                });
            }
            if (doc) {
                let flat = false;
                let listMusic = doc.listMusic;
                let lenListMusic = listMusic.length;
                let listAlbum = doc.listAlbum;
                let lenListAlbum = listAlbum.length;
                for (let j = 0; j < lenListMusic; j++) {
                    if (listMusic[j].idMusic == idMusic) {
                        for (let i = 0; i < lenListAlbum; i++) {
                            if (listAlbum[i].idAlbum == idAlbum) {
                                let listMusicInAlbum = listAlbum[i].listMusic;
                                let lenListMusicInAlbum = listMusicInAlbum.length;
                                console.log('true');
                                flat = true;
                                for (let t = 0; t<lenListMusicInAlbum; t++) {
                                    if (listMusicInAlbum[t].idMusic == idMusic) {
                                        flat = false;
                                        // console.log(listMusicInAlbum[t].idMusic);
                                    }
                                }
                                listAlbum[i].listMusic.push({
                                    idMusic:listMusic[j].idMusic
                                });
                            }
                        }
                    }
                }
                if (flat == true) {
                    doc.listAlbum = [];
                    doc.listAlbum = listAlbum;
                    doc.save();
                    res.json({
                        status: true,
                        listAlbum: doc.listAlbum
                    });
                } else {
                    res.json({
                        status: false,
                        msg: 'id is existed in album or id is music is not found'
                    })
                }
            } else {
                res.json({
                    status: false,
                    msg: 'UserId is not found'
                })
            }
        });
    });
    app.post('/api/createAlbum', (req, res) =>{
        const {albumName} = req.body;
        var id = req.cookies['idUser'];
            if (id) {
                console.log("id: ", id);
            } else {
                console.log("id not found")
            }
            console.log("id: ", id);
            id = "5e7d9bbc2fb3ca5c43912083";
            User.findOne({_id: id}, function (err, doc) {
                if (err) {
                    res.json({
                        status: false,
                        msg: err
                    });
                }
                if (doc) {
                    var newAlbum = {
                        idAlbum: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                        albumName: albumName,
                        listMusic: []
                    };
                    var listAlbum = doc.listAlbum;
                    // console.log('listAlbum: ', listAlbum);
                    // console.log(typeof(listAlbum));
                    listAlbum.push(newAlbum);
                    doc.listAlbum = listAlbum;
                    doc.save();
                    res.json({
                        status: true,
                        listAlbum: doc.listAlbum
                    })
                } else {
                    res.json({
                        status: false,
                        msg: 'UserId is not found'
                    })
                }
            });

    });
    app.get('/api/listMusicInAlbum', (req, res) =>{
        var id = req.cookies['idUser'];
        if (id) {
            // console.log("id: ", id);
        } else {
            console.log("id not found")
        }
        console.log("id: ", id);
        id = "5e7d9bbc2fb3ca5c43912083";
        const {idAlbum} = req.query;
        User.findOne({_id: id}, function (err, doc) {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                });
            }
            if (doc) {
                let arr = doc.listAlbum;
                let lenArr = arr.length;
                let tempArr = [];
                let msg;
                let flat = false;
                for (let i = 0; i < lenArr; i++) {
                    if (arr[i].idAlbum == idAlbum) {
                        // get list music in album
                        // console.log(arr[i].listMusic);
                        let listMusicOfAlbum = arr[i].listMusic;
                        // console.log(arr[i].listMusic);
                        let lenListMusicOfAlbum = listMusicOfAlbum.length;
                        if (lenListMusicOfAlbum != 0) {
                            for (let j = 0; j < lenListMusicOfAlbum; j++) {
                                let listAllOfMusic = doc.listMusic;
                                let lenListAllOfMusic = listAllOfMusic.length;
                                for (let t = 0; t < lenListAllOfMusic; t++) {
                                    if (listMusicOfAlbum[j].idMusic == listAllOfMusic[t].idMusic) {
                                        tempArr.push(listAllOfMusic[t]);
                                    }
                                }
                            }
                        } else {
                            console.log('empty');
                        }
                        flat = true;
                    } else {
                        msg = "idAlbum is not found";
                    }
                }
                if (flat == true) {
                    res.json({
                        status: true,
                        result: tempArr
                    });
                } else {
                    res.json({
                        status: false,
                        msg: msg
                    });
                }
                
            } else {
                res.json({
                    status: false,
                    msg: 'UserId is not found'
                });
            }
        });
    });
    app.delete('/api/removeAlbumInList', (req, res) => {
        let {idAlbum} = req.query;
        var id = req.cookies['idUser'];
            if (id) {
                // console.log("id: ", id);
            } else {
                console.log("id not found")
            }
            console.log("id: ", id);
            id = "5e7d9bbc2fb3ca5c43912083";
            User.findOne({_id: id}, function (err, doc) {
                if (err) {
                    res.json({
                        status: false,
                        msg: err
                    });
                }
                if (doc) {
                    let flat = false;
                    let tempArr = [];
                    var listAlbum = doc.listAlbum;
                    let lenListAlbum = listAlbum.length;
                    for (let i = 0; i <lenListAlbum; i++) {
                        if (listAlbum[i].idAlbum == idAlbum) {
                            console.log('true');
                            flat = true;
                        } else {
                            tempArr.push(listAlbum[i]);
                        }
                    }
                    doc.listAlbum = [];
                    doc.listAlbum = tempArr;
                    doc.save();
                    if (flat == true) {
                        res.json({
                            status: true,
                            result: doc.listAlbum
                        });
                    } else {
                        res.json({
                            status: false,
                            msg: 'idAlbum is not found'
                        })
                    }
                } else {
                    res.json({
                        status: false,
                        msg: 'id is not found'
                    })
                }
            });
    });
    app.post('/api/changeNameOfAlbum', (req, res) => {
        let {idAlbum, newAlbumName} = req.body;
        var id = req.cookies['idUser'];
            if (id) {
                // console.log("id: ", id);
            } else {
                console.log("id not found")
            }
            console.log("id: ", id);
            id = "5e7d9bbc2fb3ca5c43912083";
            User.findOne({_id: id}, function (err, doc) {
                if (err) {
                    res.json({
                        status: false,
                        msg: err
                    });
                }
                if (doc) {
                    var listAlbum = doc.listAlbum;
                    let lenListAlbum = listAlbum.length;
                    for (let i = 0; i <lenListAlbum; i++) {
                        if (listAlbum[i].idAlbum == idAlbum) {
                            listAlbum[i].albumName = newAlbumName;
                        }
                    }
                    doc.listAlbum = [];
                    doc.listAlbum = listAlbum;
                    doc.save();
                    res.json({
                        status: true,
                        msg: 'change image is successful'
                    });
                } else {
                    res.json({
                        status: false,
                        msg: 'idUser is not found'
                    })
                }
            });
    });
    app.get('/api/listAlbum', (req, res) => {
        var id = req.cookies['idUser'];
            if (id) {
                // console.log("id: ", id);
            } else {
                console.log("id not found")
            }
            console.log("id: ", id);
            id = "5e7d9bbc2fb3ca5c43912083";
        User.findOne({_id: id}, function (err, doc) {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                });
            }
            if (doc) {
                var listAlbum = doc.listAlbum;
                // console.log(listAlbum);
                if (listAlbum == undefined) {
                    let arr = [];
                    doc.listAlbum = arr;
                    doc.save();
                }
                let arr = doc.listAlbum;
                let lenArr = arr.length;
                let temp = [];
                // console.log(lenArr);
                for (let i = 0; i < lenArr; i++) {
                    // console.log(arr[i].albumName);
                    temp.push({
                        idAlbum: arr[i].idAlbum,
                        albumName: arr[i].albumName
                    });                    
                }
                res.json({
                    status: true,
                    result: temp
                })
            } else {
                res.json({
                    status: false,
                    msg: 'UserId is not found'
                })
            }
        })
    });
}