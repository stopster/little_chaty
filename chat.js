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
		var userId = new Cookies({ headers: hData.headers }).get("id");
		var user;
		if(userId){
			user = User.getById(userId);
		}

		if(user){
			hData.user = user;
			callback(null, true);
		} else {
			callback("Please, login first.", false);
		}
	});
	io.on("connection", function(socket){
		socket.on("enterChat", function(){
			var currentUser = socket.manager.handshaken[socket.id].user;
			socket.broadcast.emit("userOnline", User.safe(currentUser));
			socket.emit("chatEntered");
			namedSockets[currentUser.name] = socket;
		});

		socket.on("postMessage", function(data){
			if(!data || !data.message){
				socket.emit("error", {message: "Empty message is not allowed!"});
				return;
			}
			var currentUser = socket.manager.handshaken[socket.id].user;
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
				delete namedSockets[currentUser.name];
			}
		});

	});
	User.on("logout", function(user){
		var socket = namedSockets[user.name];
		if(socket){
			socket.broadcast.emit("userOffline", User.safe(user));
			delete namedSockets[user.name];
		}
	});

};