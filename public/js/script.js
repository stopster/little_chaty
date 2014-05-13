(function($, w, d){
	// Some contstants
	var apiUrl = "http://chaty.st.lviv.ua/api",
		user,
		$messages = $(".messages"),
		$statusMessage = $("<div>").addClass("status"),
		$message = $("<div>").addClass("message"),
		socket,
		chatEntered = false
	;

	function startChat(){
		socket = io.connect("http://chaty.st.lviv.ua");

		socket.on("connect", function(){
			socket.emit("enterChat", user);
		});

		socket.on("chatEntered", function(){
			chatEntered = true;
		});

		socket.on("userOnline",
			function(user){
				userStatusChanged(user, "online");
			}
		);

		socket.on("userOffline",
			function(user){
				userStatusChanged(user, "offline");
			}
		);

		socket.on("disconnect", function(){
			chatEntered = false;
		});

		socket.on("message", newMessage);
	}

	function userStatusChanged(user, status){
		var $m = $statusMessage.clone();
		$m.html("<b>" + user.name + "</b> is " + status);
		$messages.append($m);
	}

	function newMessage(data){
		$message
			.clone()
			.html("<i>" + data.user.name + "</i>: " + data.message)
			.appendTo($messages);
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
		if(socket && $(".message-text").val()){
			socket.emit("postMessage", {user:user.name, message: $(".message-text").val()});
		} else {
			$(".username").focus();
		}
	});
})(Zepto, window, document);