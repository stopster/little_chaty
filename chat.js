var User = require("./user.js").User;
var Cookies = require("cookies");
exports.Chat = function(http){
	var io = require("socket.io").listen(http,{
		"match origin protocol": true
	});

	var namedSockets = {};

	//Allows using native WebSockets or other libs, that follows the socket.io protocol
	io.set("destroy upgrade", false);


	io.set("authorization", function(hData, callback){
		var user = tryToAuthUser(hData.headers);
		if(user){
			hData.user = user;
		}
		callback(null, true);
	});
	io.on("connection", function(socket){
		socket.on("enterChat", function(user){
			var currentUser = socket.manager.handshaken[socket.id].user;
			currentUser = currentUser? currentUser: tryToAuthUser(null, user);

			if(!currentUser){
				socket.emit("error", {message: "Please, login first"});
				namedSockets[socket.id] = user.name;
				return;
			}
			socket.broadcast.emit("userOnline", User.safe(currentUser));
			socket.emit("chatEntered");
			namedSockets[socket.id] = currentUser.name;
		});

		socket.on("postMessage", function(data){
			if(!data || !data.message){
				socket.emit("error", {message: "Empty message is not allowed!"});
				return;
			}
			var currentUser = socket.manager.handshaken[socket.id].user;
			currentUser = currentUser? currentUser: tryToAuthUser(null, User.get(namedSockets[socket.id]), socket);

			if(!currentUser){
				socket.emit("error", {message: "Please, login first"});
				return;
			}
			var output = {
				user: User.safe(currentUser),
				message: data.message,
				time: Date.now()
			};
			socket.broadcast.emit("message", output);
			output.isYourMessage = true;
			socket.emit("message", output);
		});

		socket.on("disconnect", function(){
			var currentUser = socket.manager.handshaken[socket.id].user;
			if(currentUser){
				socket.broadcast.emit("userOffline", User.safe(currentUser));
				delete namedSockets[socket.id];
			}
		});

	});
	
	function tryToAuthUser(headers, userData, socket){
		var userId;
		var cookies;
		if(headers){
			cookies = new Cookies({headers: headers});
		}
		if(cookies){
			userId = cookies.get("chatId");
		} else if(userData){
			if(userData.id){
				userId = userData.id;
			} else if(userData.name && socket){
				if(namedSockets[socket.id] == userData.name){
					userId = Users.get(userData.name).id;
				}
			}
		}
		var user =	User.getById(userId);
		if(user){
			return user;
		} else {
			return false;
		}
	}
	User.on("logout", function(user){
		var socket = namedSockets[user.name];
		if(socket){
			socket.disconnect();
		}
	});

};