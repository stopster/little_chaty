define(["backbone", "underscore", "js/models/user"], function(Backbone, _, User){
	var Users = Backbone.Collection.extend({
		model: User
	});

	return Users;
});