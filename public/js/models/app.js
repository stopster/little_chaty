define(["backbone", "underscore", "js/models/activeUser", "js/collections/users"], function(Backbone, _, ActiveUser, Users){
	var AppModel = Backbone.Model.extend({
		initialize: function(){
			this.set("activeUser", new ActiveUser());
			this.set("users", new Users());
		}
	});

	return AppModel;
});