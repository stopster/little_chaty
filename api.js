var User = require("./user.js").User;
var jstrfy = JSON.stringify;
var crypto = require("crypto");
var Cookies = require("cookies");
var fs = require("fs");

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

	app.post(pre + "/users/authorize", function(req, res){
		var cookies = new Cookies(req, res);
		var user = User.getById(cookies.get("id"));
		if(user){
			res.send(jstrfy(user));
		} else {
			res.statusCode = 403;
			res.send(jstrfy({message: "You are not logged in or your session expired."}));
		}
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

	var uploadsDir = app.get("userUploads");
	app.post(pre + "/users/upload", function(req, res){
		var user = User.getById(new Cookies(req, res).get("id"));
		var fileType = req.get("Content-Type");
		var fileSize = req.get("Content-Length");
		var allowedTypes = ["image/png", "image/jpeg", "image/gif"];
		var onSuccess = function(fileName){
			var imageUrl = uploadsDir + "/" + fileName;
			if(user.imageUrl){
				deleteFile(user.imageUrl);
			}
			User.attachFile(user, imageUrl);	
			res.send(jstrfy({imageUrl: imageUrl}));
		}
		var onError = function(message, code){
			res.statusCode = code && parseInt(code, 10)? code: 400;
			res.send(jstrfy({message: message? message: "Something went wrong. Please, check documentation to the API."}));
		}
		if(!user){
			onError("Please, login first", 403);
			return;
		}

		if(allowedTypes.indexOf(fileType) === -1){
			onError("Not supported type. Please, send image as binary with proper Content-Type header. Following allowed: " + allowedTypes.join(", "), 400);
			return;
		}

		// If file size greater than 2 Mb
		if(fileSize/1024/1024 > 2){
			onError("File is too large. Only files, lighter than 2Mb allowed.", 400);
			return;
		}

		safeFile(req, fileType, onSuccess, onError);
	});

	User.on("logout", function(user){
		if(user.imageUrl){
			fs.unlink(__dirname + user.imageUrl);
		}
	});

	function safeFile(readable, fileType, onSuccess, onError){
		var fileName = "image-" + Date.now() + "." + fileType.substr(6);
		readable.pipe(fs.createWriteStream(__dirname + uploadsDir + "/" + fileName));
		readable.on("end", function(){
			onSuccess(fileName);
		});
		readable.on("error", function(){
			onError("File wasn't saved. Something went wrong. Please, try again or contact site admin.", 500);
		});
	}

	function deleteFile(imageUrl){
		fs.unlink(__dirname + imageUrl);
	}
};




