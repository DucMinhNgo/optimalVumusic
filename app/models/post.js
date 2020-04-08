var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
    contents: {
		   type: String,
		   require: true
    },
    likes: {
        type:Number,
        default: 0
    },
    views: {
        type:Number,
        default: 0
    },
    idWriter:{
        type:String,
        require: true
    },
    commands: {
		    type: String,
		    require: true
    },
    createDate: {
        type: Date,
        default: Date.now()
    },
    modifyDate: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('post', postSchema);
