define(["conf", "backbone", "underscore", "jquery", "js/models/user"], function(conf, Backbone, _, $, User){
	var ActiveUser = User.extend({
		defaults: {
			authenticated: false,
			name: null,
			sex: null
		},
		isNameAvailable: function(name, callback){
			$.ajax({
				type: "GET",
				url: conf.apiUrl + "/users/isLoggedIn/" + name,
				success: function(data){ var pData = JSON.parse(data); callback(!pData.success); },
				error: function(){ callback(false); }
			});
		},
		authenticate: function(){
			var authUrl = conf.apiUrl + "/users/authorize";
			$.ajax({
				type: "POST",
				url: authUrl,
				success: function(data){
					var userData = JSON.parse(data);
					this.set("authenticated", true);
					this.set("id", userData.hash);
					this.trigger("authenticated", this);
				}.bind(this),
				error: function(){
					this.set("authenticated", false);
					this.trigger("authenticated", this);
				}.bind(this)
			});
			this.trigger("startAction");
		},
		login: function(onSuccess, onError){
			var loginUrl = conf.apiUrl + "/users/login";
			$.ajax({
				type: "POST",
				url: loginUrl,
				contentType: "application/json",
				data: JSON.stringify(this.toJSON()),
				success: function(data){
					var pData = JSON.parse(data);
					if(onSuccess){
						onSuccess(pData);
					}
					this.set("authenticated", true);
					this.trigger("authenticated", this);
				}.bind(this),
				error: function(){
					if(onError){
						onError();
					}
					this.set("authenticated", false);
					this.trigger("authenticated", this);
				}.bind(this)
			});
			this.trigger("startAction");
		},
		logout: function(onSuccess, onError){
			var logoutUrl = conf.apiUrl + "/logout";
			$.ajax({
				type: "POST",
				url: logoutUrl,
				success: onSuccess,
				error: onError
			});
		}
	});

	return ActiveUser;
});