require.config({
	baseUrl: "/",
	paths: {
		jquery: "vendor/zepto/zepto.min",
		backbone: "vendor/backbone/backbone",
		underscore: "vendor/underscore/underscore",
		jsx: "vendor/react/JSXTransformer.js",
		react: "vendor/react/react.min",
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

require(["views/app"], function(AppView, appTpl){
	new AppView({el: $(".container")});
});
