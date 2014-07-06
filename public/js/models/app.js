define(["backbone", "underscore", "js/models/activeUser", "js/collections/users"], function(Backbone, _, ActiveUser, Users){
	var AppModel = Backbone.Model.extend({
		createActiveUser: function(){
			var activeUser = new ActiveUser();
			this.set("activeUser", activeUser);
			return activeUser;
		}
	});

	return AppModel;
});