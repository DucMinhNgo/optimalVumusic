var User = require('../models/user');
module.exports = app => {
    app.get('/api/defaultmusic', (req, res) => {
        id = '5e8ed571be56097886bb7e89';
        User.findOne({_id: id}, function (err, doc) {
            if (doc) {
                res.json({
                    status:true,
                    result: doc.listMusic
                })
            } else {
                res.json({
                    status: false,
                    msg: 'id is not found'
                })
            }
        });
    })
}