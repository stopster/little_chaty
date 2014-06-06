/** @jsx React.DOM */
define(["jquery", "backbone", "underscore", "react"], function($, Backbone, _, jsx, React){
    var a = React.createClass({
        render: function(){
            return (
                <div>test</div>
            );
        }
    });
	var App = Backbone.View.extend({
		initialize: function(options){
			this.render();	
		},
		render: function(){
		    React.renderComponent(a, this.el);
		    this.$el.appendTo("body");
		}
	});

	return App;
});