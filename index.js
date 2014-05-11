var express = require("express");
var bodyParser = require("body-parser");
var app = new express();

var apiPort = 5000;
var chatPort = 6000;

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

// expose client on /client url
app.set("enableClient", true);

var client = require("./client.js").Client(app);
var api = require("./api.js").Api(app);
var chat = require("./chat.js").Chat(chatPort);

app.listen(apiPort);
