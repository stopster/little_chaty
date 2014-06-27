define(["jquery", "react", "backbone", "underscore", "jsx!js/views/app"], function($, React, Backbone, _, AppView){
	var App = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		render: function(){
			React.renderComponent(AppView({ model: this.model }), this.el);
			return this;
		}
	});
	return App;
});