define(["backbone", "underscore"], function(Backbone, _){
	var User = Backbone.Model.extend({
		defaults: {
			imageUrl: "/images/basic-avatar.png"
		},
		toJSON: function(){
			return {
				name: this.get("name"),
				sex: this.get("sex"),
				imageUrl: this.get("imageUrl")
			};
		}
	});

	return User;
});