define(["backbone", "underscore"], function(Backbone, _){
	var User = Backbone.Model.extend({
		defaults: {
			imageUrl: "/images/basic-avatar.png"
		}
	});

	return User;
});