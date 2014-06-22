define(["backbone", "underscore"], function(Backbone, _){
	var User = Backbone.Model.extend({
		url: "/api/users"
	});

	return User;
});