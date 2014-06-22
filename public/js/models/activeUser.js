define(["backbone", "underscore", "js/models/user"], function(Backbone, _, User){
	var ActiveUser = User.extend({
		login: function(){},
		logout: function(){}
	});

	return ActiveUser;
});