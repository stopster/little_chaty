exports.Client = function(app){
	app.set("views", __dirname + "/views");

	app.get("/", function(req, res){
		res.sendfile(app.get("views") + "/index.html");
	});

};