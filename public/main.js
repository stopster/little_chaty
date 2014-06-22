require.config({
	baseUrl: "/",
	paths: {
		jquery: "vendor/zepto/zepto.min",
		backbone: "vendor/backbone/backbone",
		underscore: "vendor/underscore/underscore",
		text: "vendor/requirejs-text/text",
		react: "vendor/react/react",
		JSXTransformer: "vendor/jsx-requirejs-plugin/js/JSXTransformer-0.10.0",
		jsx: "vendor/jsx-requirejs-plugin/js/jsx"
	},
	shim: {
		jquery: {
			exports: "$"
		}
	},
	jsx: {
		fileExtension: ".jsx"
	}
});

require(["jquery", "js/views/appView", "js/models/app"], function($, AppView, AppModel){
	var app = new AppView({ el: $("#chat-app"), model: new AppModel() });
});
