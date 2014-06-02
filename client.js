exports.Client = function(app){
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");

	app.get("/", function(req, res){
		res.render("client");
	});

};