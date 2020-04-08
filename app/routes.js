var User = require('./models/user');
var VerifyToken = require('../auth/VerifyToken');
/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config/token'); // get config file

module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.json({result: true});
	});
	app.get('/checklogin', function(req, res){
		res.render('index.ejs');
	});

	app.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', { user: req.user });
	});

	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

	// app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: 'https://viws.ddns.net/home/vimusic',
	//                                       								   failureRedirect: '/' }));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }),
	function(req, res) {
		// create a token
		var token = jwt.sign({ id: req.user._id }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		  });
		  console.log (req.user._id);
		  res.cookie('token', token, { maxAge: 1000*60*60*24*7, httpOnly: true });
		  res.cookie('idUser', req.user._id, {maxAge: 1000*60*60*24*7, httpOnly: true});
		//   return res.redirect('http://localhost:4200/home/homepage?id=' + req.user._id + "&token=" + token);
			res.redirect('https://viws.ddns.net/home/homepage?id=' + req.user._id + "&token=" + token);
	  }
	);
	app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	// app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: 'https://viws.ddns.net/home/vimusic',
	//                                       failureRedirect: '/' }), function(req, res) {
	// 										// res.redirect('/');
	// 									  });
	app.get('/auth/google/callback', passport.authenticate('google', { session: false }),
				function(req, res) {
					// create a token
    				var token = jwt.sign({ id: req.user._id }, config.secret, {
						expiresIn: 86400 // expires in 24 hours
	  				});
					// console.log (req.user._id);
					// setting cookies
					/*
					* setTime 7 days for cookie in browser
					*/
					res.cookie('token', token, { maxAge: 1000*60*60*24*7, httpOnly: true });
					res.cookie('idUser', req.user._id, {maxAge: 1000*60*60*24*7, httpOnly: true});
					// return res.redirect('http://localhost:4200/home/homepage?id=' + req.user._id + "&token=" + token);
					res.redirect('https://viws.ddns.net/home/homepage?id=' + req.user._id + "&token=" + token);
	  			}
	);
	app.get('/getcookie', function(req, res) {
		// var token = req.cookies['token'];
		var idUser = req.cookies['idUser'];
		if (idUser) {
			return res.send({
				// token: token,
				idUser: idUser,
				cookies: req.cookies
			});
		}
	
	// 	return res.send('No cookie found');
	// });
	app.get('/api/setcookie', function(req, res){
		// setting cookies
		res.cookie('idUser', Math.random()*100, { maxAge: 900000, httpOnly: true });
		return res.send('Cookie has been set');
	});
	// app.get('/api/getcookie', function(req, res) {
	// 	var username = req.cookies['idUser'];
	// 	if (username) {
	// 		return res.send(username);
	// 	}
	
		return res.send('No cookie found');
	});


	app.get('/logout', function(req, res){
		res.clearCookie('idUser');
		res.json({
			status: true,
			msg: 'clear cookie'
		});
	})

	app.get('/test1', function(req, res){
		res.json({
			result:'test'

		})
	});
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}