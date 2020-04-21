var Post = require('../models/post')

module.exports = function (app) {
    app.get('/api/getlistpost', function (req, res) {
        Post.find({}, function (err, docs) {
            if (!err) {
                console.log(docs);
                res.json({
                    status: true,
                    result: docs
                });

            } else {
                res.json({
                    status: false,
                    result: docs
                });
            }
        });
    });
    app.post('/api/addpost', function (req, res) {
        const { contents, idWriter, commands } = req.body
        var newPost = new Post();
        newPost.contents = contents
        newPost.idWriter = idWriter
        newPost.commands = commands
        newPost.save(function (err) {
            if (err) {
                res.json({
                    status: false,
                    result: 'add post is failed'
                })
            }
        })
        res.json({
            status: true,
            result: newPost
        })
    });

    app.put('/api/showpost/:id', function (req, res) {
        // console.log(req.params.id)
        // const id = req.params.id
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
        Post.findOne({ _id: id }, function (err, doc) {
            if (doc) {
                doc.contents = 'dustin content'
                doc.save();
                res.json({
                    status: true,
                    result: doc
                })
            } else {
                res.json({
                    status: false,
                    result: 'id is not found'
                })

            }
        });
    });
    app.delete('/api/removepost', function (req, res) {
        // const id = req.params.id
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
        Post.remove({ _id: id }, function (error, doc) {
            if (doc) {
                res.json({
                    status: true,
                    result: doc
                })
            }
            else {
                res.json({
                    status: false,
                    result: 'remove is failded'
                })

            }
        })
    });
}