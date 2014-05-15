exports.Client = function(app){
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");

	app.get("/", function(req, res){
		res.send("Chat app");
	});

	var clientPath = process.env.fe_academy_chat_client_path;

	if(clientPath){
		app.get("/" + clientPath, function(req, res){
			res.render("client");
		});
	}

};