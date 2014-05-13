var user = require("./user.js");
var jstrfy = JSON.stringify;
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
		res.send(user.isLoggedIn(req.params.userName));
	});

	// Login user
	// Username need to be provided
	app.post(pre + "/users", function(req, res){
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Content-type", "application/json");
		if(req.body && req.body.name){
			var newUser = {
				name: req.body.name,
				sex: req.body.sex? req.body.sex: null
			};

			if(user.isLoggedIn(newUser)){
				res.statusCode = 409;
				res.send(jstrfy({message: "User already logged in. Choose another name."}));
			} else {
				user.login(newUser);
				res.send(jstrfy(newUser));
			}
		} else {
			res.statusCode = 400;
			res.send(jstrfy({message:"Username is missing."}));
		}
	});
};