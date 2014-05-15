var express = require("express");
var bodyParser = require("body-parser");
var app = new express();
var http = require("http").createServer(app);

var apiPort = 5000;
var chatPort = 6000;
var secretPublic = process.env.FE_ACADEMY_CHAT_CLIENT_DIR;

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
if(secretPublic){
	app.use(express.static(__dirname + "/" + secretPublic));
}

var client = require("./client.js").Client(app);
var api = require("./api.js").Api(app);

var chat = require("./chat.js").Chat(http);

http.listen(apiPort);
