define(["conf", "backbone", "underscore", "js/models/user"], function(conf, Backbone, _, User){
	var Users = Backbone.Collection.extend({
		model: User,
		url: conf.apiUrl + "/users"
	});

	return Users;
});