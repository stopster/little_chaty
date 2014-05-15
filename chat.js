var User = require("./user.js").User;

exports.Chat = function(http){
	var io = require("socket.io").listen(http);
	// Store sockets that should be notified
	var socks = [];
	// Link socket id with user id
	var namedSocks = {};

	function disconectUserSocket(user){
		var socket;
		for(var name in namedSocks){
			if(namedSocks[name] == user.name){
				// Found socket id
				// search for socket now
				socks.forEach(function(s, index){
					if(s.id == name){
						socket = s;
						return;
					}
				});
				break;
			}
		}

		if(!socket){
			return false;
		}

		delete namedSocks[socket.id];
		socks.splice(socks.indexOf(socket), 1);
		
		socks.forEach(function(s, index){
			s.emit("userOffline", User.safe(user));
		});
	}
	//Allows using native WebSockets or other libs, that follows the socket.io protocol
	io.set("destroy upgrade", false);

	io.on("connection", function(socket){
		socket.on("enterChat", function(user){
			if(user && User.isLoggedIn(user)){
				socks.forEach(function(s, index){
					s.emit("userOnline", User.safe(user));
				});
				namedSocks[socket.id] = user.name;
				socks.push(socket);
				socket.emit("chatEntered");
			} else {
				socket.emit("error", {message: "Please, login first."});
			}
		});

		socket.on("postMessage", function(data){
			var userName = namedSocks[socket.id];
			if(!User.isLoggedIn(userName)){
				socket.emit("error", {message: "Please, login first."});
			} else {
				var output = {
					user: User.safe(User.get(userName)),
					message: data.message
				};
				socks.forEach(function(s, index){
					if(s.id == socket.id){
						output.isYourMessage = true;

					} else {
						delete output.isYourMessage;
					}
					s.emit("message", output);
				});
			}
		});

		socket.on("disconnect", function(){
			var user = User.get(namedSocks[socket.id]);
			if(user){
				disconectUserSocket(user);
			}
		});

	});

	User.on("logout", function(user){
		disconectUserSocket(user);
	});

};