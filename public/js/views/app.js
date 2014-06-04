define(["jquery", "backbone", "underscore", "mustache"], function($, Backbone, _, Mustache){
	var App = Backbone.View.extend({
		initialize: function(options){
			this.template = options.template;
			this.render();
		},
		render: function(){
			this.$el.html(Mustache.render(this.template));
			return this;
		}
	});

	return App;
});