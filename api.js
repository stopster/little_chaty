var User = require("./user.js").User;
var fs = require("fs");
var jstrfy = JSON.stringify;
var crypto = require("crypto");
var Cookies = require("cookies");

exports.Api = function(app){
	app.all('*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	});

	var pre = "/api";
	// Get user info
	app.get(pre + "/users/:userName?", function(req, res){
		var foundUsers = User.get(req.params.userName, true);
		if(foundUsers){
			res.send(foundUsers);
		} else {
			res.statusCode = 404;
			res.send(jstrfy({message: "User: '" + req.params.userName + "' not found."}));
		}
	});

	// Check if user is online. Return true or false
	app.get(pre + "/users/isLoggedIn/:userName", function(req, res){
		res.send(jstrfy({success: User.isLoggedIn(req.params.userName)}));
	});

	// Login user
	// Username need to be provided
	app.post(pre + "/users/login", function(req, res){
		if(req.body && req.body.name){
			var newUser = {
				name: req.body.name,
				sex: req.body.sex? req.body.sex: null,
				id: crypto.createHash("sha1").update("" + Math.random()*1000000 + req.body.name).digest("hex")
			};

			if(User.isLoggedIn(newUser)){
				res.statusCode = 409;
				res.send(jstrfy({message: "User already logged in. Choose another name."}));
			} else {
				User.login(newUser);
				var cookies = new Cookies(req, res);
				cookies.set("id", newUser.id);
				res.send(jstrfy(newUser));
			}
		} else {
			res.statusCode = 400;
			res.send(jstrfy({message:"Username is missing."}));
		}
	});

	app.post(pre + "/users/logout", function(req, res){
		var success;
		var cookies = new Cookies(req, res);
		var userId = cookies.get("id");

		userId = userId? userId: req.body.id;
		success = User.logout({id: userId});

		if(success){
			res.send({success: true});
		} else {
			res.statusCode = 404;
			res.send(jstrfy({message: "Please, provide user id received during login."}));
		}
	});

	app.post(pre + "/users/upload", function(req, res){
		req.pipe(fs.createWriteStream(__dirname + "/uploads/test2.png"));
		res.send(jstrfy({success: true}));
	});
};