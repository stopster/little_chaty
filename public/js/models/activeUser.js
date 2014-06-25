define(["conf", "backbone", "underscore", "jquery", "js/models/user"], function(conf, Backbone, _, $, User){
	var ActiveUser = User.extend({
		defaults: {
			authenticated: false,
			name: null,
			sex: null
		},
		initialize: function(options){
		},
		authenticate: function(onSuccess, onError){
			var authUrl = conf.apiUrl + "/users/authorize";
			$.ajax({
				type: "POST",
				url: authUrl,
				success: onSuccess,
				error: onError
			});
		},
		login: function(onSuccess, onError){
			var loginUrl = conf.apiUrl + "/users/login";
			$.ajax({
				type: "POST",
				url: loginUrl,
				data: JSON.stringify(this.toJSON()),
				success: onSuccess,
				error: onError
			});
		},
		logout: function(){}
	});

	return ActiveUser;
});