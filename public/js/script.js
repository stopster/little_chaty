(function($, w, d){
	// Some contstants
	var apiUrl = window.location + "api",
		chatUrl = window.location,
		user,
		$messages = $(".messages"),
		$statusMessage = $("<div>").addClass("status"),
		$message = $("<div>").addClass("message"),
		socket,
		chatEntered = false
	;

	function startChat(){
		socket = io.connect(chatUrl, {"force new connection": true});

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

	function stopChat(){
		chatEntered = false;
		socket.disconnect();
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
				url: apiUrl + "/users/login",
				data: JSON.stringify({"name": name, "sex": sex}),
				processData: false,
				contentType: "application/json",
				success: function(data){
					user = data;
					startChat();
					$(".username").css("border", "1px solid green");	
				},
				error: function(){
					console.log("error", arguments);
				}
			});
		}
	});

	$(".logout").bind("click", function(event){
		$.ajax({
			type: "post",
			url: apiUrl + "/users/logout",
			data: JSON.stringify({id: user.id}),
			processData: false,
			contentType: "application/json",
			success: function(data){
				console.log("logged out", data);
				$(".username").css("border", "1px solid grey");	
				stopChat();
			},
			error: function(data){
				console.log("error logged out", data);
			}
		});
	});

	$(".send").bind("click", function(e){
		if(socket && $(".message-text").val()){
			socket.emit("postMessage", {user:user.name, message: $(".message-text").val()});
		} else {
			$(".username").focus();
		}
	});
})(Zepto, window, document);