/** @jsx React.DOM */
define(["jquery", "backbone", "underscore", "jsx", "react"], function($, Backbone, _, jsx, React){
	var App = Backbone.View.extend({
		initialize: function(options){
			this.render();	
		},
		render: function(){
			this.$el.html(appTpl);
		}
	});

	return App;
});