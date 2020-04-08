var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var queueSchema = mongoose.Schema({
    arrRequest: {
        type: Array,
        default: []
    },
    arrResponse: {
        type: Array,
        default: []
    },
    createDate: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Queue', queueSchema);