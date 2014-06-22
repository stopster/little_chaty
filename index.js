var express = require("express");
var bodyParser = require("body-parser");
var app = new express();
var http = require("http").createServer(app);
var fs = require("fs");

var apiPort = 8080;

app.set("userUploads", "/uploads");

require("rimraf").sync(__dirname + app.get("userUploads"));
fs.mkdirSync(__dirname + app.get("userUploads"), "775");

app.use(bodyParser({
	limit: 3*1024*1024
}));
app.use(express.static(__dirname + '/public'));
app.use(app.get("userUploads"), express.static(__dirname + app.get("userUploads")));

var client = require("./client.js").Client(app);
var api = require("./api.js").Api(app);

var chat = require("./chat.js").Chat(http);

http.listen(apiPort);
