var User = require("./user.js").User;
var jstrfy = JSON.stringify;
var crypto = require("crypto");

exports.Api = function(app){
	var pre = "/api";
	// Get user info
	app.get(pre + "/users/:userName", function(req, res){
		var foundUser = user.get(req.params.userName);
		if(foundUser){
			res.send(foundUser);
		} else {
			res.statusCode = 404;
			res.send("User: '" + req.params.userName + "' not found.");
		}
	});

	// Check if user is online. Return true or false
	app.get(pre + "/users/:userName/isLoggedIn", function(req, res){
		res.send(User.isLoggedIn(req.params.userName));
	});

	// Login user
	// Username need to be provided
	app.post(pre + "/users/login", function(req, res){
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Content-type", "application/json");
		if(req.body && req.body.name){
			var newUser = {
				name: req.body.name,
				sex: req.body.sex? req.body.sex: null,
				id: crypto.createHash("sha1").update("" + Math.random()*10000).digest("hex")
			};

			if(User.isLoggedIn(newUser)){
				res.statusCode = 409;
				res.send(jstrfy({message: "User already logged in. Choose another name."}));
			} else {
				User.login(newUser);
				res.send(jstrfy(newUser));
			}
		} else {
			res.statusCode = 400;
			res.send(jstrfy({message:"Username is missing."}));
		}
	});

	app.post(pre + "/users/logout", function(req, res){
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Content-type", "application/json");
		if(req.body && req.body.id){
			var success = User.logout({id: req.body.id});	
		} else {
			res.statusCode = 404;
			res.send(jstrfy({message: "Please, provide user id received during login."}));
		}
		if(success){
			res.send(jstrfy({success: true}));
		} else {
			res.statusCode = 500;
			res.send(jstrfy({message: "Could not logout user. Check user id, that you send and try again."}));
		}
	});
};