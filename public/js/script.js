(function($, w, d){
	// Some contstants
	var apiUrl = "http://localhost:5000/api"
	;

	function startChat(user){
		var s = new WebSocket("ws://localhost:5000/chat", "protocol1");
		s.onopen = function(){
			console.log("on open", arguments);
		};
		// s.send(JSON.stringify({message:"hello!"}));
	}
	$(".login").bind("click", function(event){
		var name = $(".username").val();
		var sex = $(".sex:checked").length>0? $(".sex:checked").val(): null;

		if(name && name.length > 0){
			$.ajax({
				type: "post",
				url: apiUrl + "/users",
				data: JSON.stringify({"name": name, "sex": sex}),
				processData: false,
				contentType: "application/json",
				success: function(data){
					setTimeout(function(){
						startChat(data);
					}, 1000);
				},
				error: function(){
					console.log("error", arguments);
				}
			});
		}
	});
})(Zepto, window, document);