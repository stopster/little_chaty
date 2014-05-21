var User = require("./user.js").User;
var jstrfy = JSON.stringify;
var crypto = require("crypto");
var fs = require("fs");
var formidable = require("formidable");
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

	app.post(pre + "/users/authorize", function(req, res){
		var cookies = new Cookies(req, res);
		var userId = cookies.get("chatId");
		var user = User.getById(userId);
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
		var contType = req.get("Content-Type");
		if(/^(multipart\/form\-data)/i.test(contType)){
			handleUserDataForm(req, res);
		} else {
			handleUserDataJson(req, res);
		}
	});

	app.post(pre + "/users/logout", function(req, res){
		var success;
		var cookies = new Cookies(req, res);
		var userId = cookies.get("chatId");

		userId = userId? userId: req.body.id;
		success = User.logout({id: userId});

		if(success){
			cookies.set("chatId", "");
			res.send({success: true});
		} else {
			res.statusCode = 404;
			res.send(jstrfy({message: "Please, provide user id received during login."}));
		}
	});

	var uploadsDir = app.get("userUploads");
	app.post(pre + "/users/upload", function(req, res){
		var user = User.getById(new Cookies(req, res).get("chatId"));
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
		console.log(fileType);
		if(allowedTypes.indexOf(fileType) === -1){
			onError("Not supported type. Please, send image as binary with proper Content-Type header. Following allowed: " + allowedTypes.join(", "), 400);
			return;
		}

		// If file size greater than 2 Mb
		if(fileSize > 2*1024*1024){
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

	function handleUserData(name, sex){
		if(!name){
			return {success: false, code: 400, message: "Name is required!"};
		}
		var newUser = {
			name: name,
			sex : sex && /male|female/i.test(sex)? sex: null,
			id  : crypto.createHash("sha1").update("" + Math.random()*1000000 + name).digest("hex")
		}
		if(User.isLoggedIn(newUser)){
			return {success: false, code: 409, message: "User already logged in. Choose another name."};
		}

		var success = User.login(newUser);
		return {success: success, user: newUser};
	}

	function handleUserDataJson(req, res){
		if(req.body){
			var loginResult = handleUserData(req.body.name, req.body.sex);
			var user;
			if(loginResult.success){
				user = loginResult.user;
				var cookies = new Cookies(req, res);
				cookies.set("chatId", user.id);
				res.send(jstrfy(user));
			} else {
				res.statusCode = loginResult.code;
				res.send(jstrfy({message: loginResult.message}));
			}
		} else {
			res.statusCode = 400;
			res.send({message: "Please, provide data in json"});
		}
	}

	function handleUserDataForm(req, res){
		var form = new formidable.IncomingForm();
		var user;
		var allowedTypes = ["image/png", "image/jpeg", "image/gif"];
		form.parse(req, function(err, fields, files){
			var loginResult = handleUserData(fields.name, fields.sex);
			if(loginResult.success){
				user = loginResult.user;
				var onSuccess = function(){
					var cookies = new Cookies(req, res);
					cookies.set("chatId", user.id);
					res.send(jstrfy(user));
				}

				if(files && files.image){
					var file = files.image;
					var onError = function(message, code){
						res.statusCode = code && parseInt(code, 10)? code: 400;
						res.send(jstrfy({message: message? message: "Something went wrong. Please, check documentation to the API."}));
					}
					if(!user){
						onError("Please, login first", 403);
						return;
					}

					if(allowedTypes.indexOf(file.type) === -1){
						onError("Not supported type. Please, send image as binary with proper Content-Type header or as multipart-data. Following image formats allowed: " + allowedTypes.join(", "), 400);
						return;
					}

					// If file size greater than 2 Mb
					if(file.size > 2*1024*1024){
						onError("File is too large. Only files, lighter than 2Mb allowed.", 400);
						return;
					}

					var s = fs.createReadStream(file.path);
					safeFile(s, file.type, function(fileName){
						User.attachFile(user, app.get("userUploads") + "/" + fileName);
						onSuccess();
					}, onError);
				} else {
					onSuccess();
				}
			} else {
				res.statusCode = loginResult.code;
				res.send(jstrfy({message: loginResult.message}));
			}
		});
	}
};
