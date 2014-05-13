var user = require("./user.js");
exports.Chat = function(http){
	var io = require("socket.io").listen(http);
	//Allows using native WebSockets or other libs, that follows the socket.io protocol
	io.set("destroy upgrade", false);
	io.on("connection", function(s){
		s.on("message", function(data){
			s.emit("message", data);
		});
	});
};