define([
		"jquery",
		"backbone",
		"underscore",
		"js/models/activeUser",
		"jsx!js/views/login",
		"jsx!js/views/activeUser"
	], function($, Backbone, _, ActiveUserModel, LoginRview, ActiveUserRview){
	var ActiveuserView = Backbone.View.extend({
		initialize: function(options){
			this.render();
		},

	});
});