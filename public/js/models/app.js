define(["backbone", "underscore", "js/models/activeUser", "js/collections/users"], function(Backbone, _, ActiveUser, Users){
	var AppModel = Backbone.Model.extend({
		activeUser: new ActiveUser(),
		users: new Users()
	});

	return AppModel;
});