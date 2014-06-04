require.config({
	baseUrl: "/",
	paths: {
		text: "vendor/requirejs-text/text",
		jquery: "vendor/zepto/zepto.min",
		backbone: "vendor/backbone/backbone",
		underscore: "vendor/underscore/underscore",
		mustache: "vendor/mustache/mustache",
		models: "js/models",
		views: "js/views",
		collections: "js/collections",
		tpls: "templates"
	},
	shim: {
		jquery: {
			exports: "$"
		}
	}
});

require(["views/app", "text!tpls/app.html"], function(AppView, appTpl){
	new AppView({template: appTpl, el: $(".container")});
});
