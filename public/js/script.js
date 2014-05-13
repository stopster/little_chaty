(function($, w, d){
	// Some contstants
	var apiUrl = "http://localhost:5000/api",
		s,
		user
	;

	function startChat(user){
		s = io.connect("http://localhost:5000");
		// s.on("connect", function(){

		// });
		s.on("message", function(data){
			$(".messages").append("<div><b>" + data.user + "</b> wrote: " + data.message + "</div>");
		});
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
					user = data;
					startChat();
				},
				error: function(){
					console.log("error", arguments);
				}
			});
		}
	});

	$(".send").bind("click", function(e){
		if(s && $(".message").text().length>0){
			s.emit("postmessage", {user:user.name, message: $(".message").text()});
		} else {
			$(".username").focus();
		}
	});
})(Zepto, window, document);