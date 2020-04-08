var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var today = new Date();
var main = {
	"verse": [
		"I've been alone with you inside my mind",
		"And in my dreams I've kissed your lips a thousand times",
		"I sometimes see you pass outside my door",
		"Hello, is it me you're looking for?"
	],
	"chorus":
	[
		"Hello from the other side",
		"I must've called a thousand times",
		"To tell you I'm sorry for everything that I've done",
		"But when I call you never seem to be home",
		"Hello from the outside",
		"At least I can say that I've tried",
		"To tell you I'm sorry for breaking your heart",
		"But it don't matter, it clearly doesn't tear you apart anymore"
	]
	};
var userSchema = mongoose.Schema({
	email: {
		type: String,
		require: true
	},
	password: {
		type:String,
		require: true
	},
	name: {
		type: String,
		require: true
	},
	local: {
		username: String,
		password: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	createDate: {
		type: Date,
		default: Date.now()
	  },
	  modifyDate: {
		type: Date,
		default: Date.now()
	  },
	  expiration: {
		type: Date,
		default: today.setDate(today.getDate()+30)
	  },
	  status: {
		type: Number,
		default:1
	  },
	  role: {
		type: String,
		default: 'signup'
	  },
	  language: {
		  type: String,
		  require: true
	  },
	  gender: {
		  type: String,
		  require: true
	  },
	  picture: {
		  type: String,
		  default: ""
	  },
	  coverPhoto: {
		  type: String,
		  require: true
	  },
	  provider: {
		type: String,
		require: true
	  },
	  listAddress: {
		type: Array,
		default: []
	  },
	  listPayment: {
		  type: Array,
		  default: []
	  },
	  listMusic: {
		  type: Array,
		  default: [{
			idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
			key: 0,
			title: "demo 1",
			duration: 444,
			parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
			createDate:new Date(),
			likeStatus:'false',
			link: "1.mp3",
			lyric: main
		},
		{
		idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
		key: 1,
		title: "demo 2",
		duration: 231,
		parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
		createDate:new Date(),
		likeStatus:'false',
		link: "2.mp3",
		lyric: main
	}
	]
	  },
	  listProfile: {
		  type: Array,
		  default: []
	  },
	  moreInformation: {
		  type: String,
		  require: true
	  },
	  notificationBlog: {
		  type: String,
		  require: true
	  }
	  
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);