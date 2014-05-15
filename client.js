exports.Client = function(app){
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");

	app.get("/", function(req, res){
		res.send("Chat app");
	});

	var clientPath = process.env.FE_ACADEMY_CHAT_CLIENT_PATH;
	var secretPublic = process.env.FE_ACADEMY_CHAT_CLIENT_DIR;

	if(clientPath){
		app.get("/" + clientPath, function(req, res){
			res.render("client", {secretPublic: secretPublic});
		});
	}

};