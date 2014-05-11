exports.Client = function(app){
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");

	app.get("/", function(req, res){
		if(app.get("enableClient")){
			res.render("client");
		} else {
			res.send("Chat app");
		}
	});
};