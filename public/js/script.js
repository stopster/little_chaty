(function($, w, d){
	// Some contstants
	var prod = 0,
		baseUrl = prod? "http://chaty.st.lviv.ua:5000": "http://localhost:5000",
		apiUrl = baseUrl + "/api",
		chatUrl = baseUrl,
		user,
		$messages = $(".chat"),
		$message = $("<div>").addClass("message"),
		$userMessage = $(".message-text"),
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
			.html("<i>" + data.user.name + "</i>: " + processText(data.message))
			.appendTo($messages);
	}

	function processText(message){
		return message
			.replace(/\n./g, "<br/>")
			.replace(/(http\:\/\/.+)/, "<a href=\"$1\">$1</a>")
			;
	}

	function sendMessage(message){
		if(message && message.length>0){
			socket.emit("postMessage", {message: message});
		}
	}

	
	$(".start-chat").bind("click", function(event){
		var name = $(".username").val();
		var sex = $(".sex-buttons .active").length>0? $(".sex-buttons .active").text(): null;
		var loginUser=function(name, sex, image){
			$.ajax({
				type: "post",
				url: apiUrl + "/users/login",
				data: JSON.stringify({name: name, sex: sex, image: image}),
				contentType: "application/json",
				success: function(data){
					user = JSON.parse(data);
					startChat();
				},
				error: function(){
					console.log("error", arguments);
				}
			});
		}
		var file; //$("[name=image]")[0].files[0];
		if(file){
			var fileReader = new FileReader();
			var image = null;
			fileReader.onload = function(event){
				image = event.target.result;
				loginUser(name, sex, image);
			}
			fileReader.readAsDataURL(file);
		} else {
			loginUser(name, sex);
		}
	});

	$(".logout").bind("click", function(event){
		$.ajax({
			type: "post",
			url: apiUrl + "/users/logout",
			data: JSON.stringify(user),
			processData: false,
			contentType: "application/json",
			success: function(data){
				stopChat();
			},
			error: function(data){
				console.log("error logged out", data);
			}
		});
	});

	$(".send").bind("click", function(e){
		sendMessage($userMessage.val());
		$userMessage.val("");
	});

	$(".sex-buttons .btn").click(function(e){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
	});

	$userMessage.bind("keyup", function(e){
		if(e.which === 13){
			if(e.ctrlKey){
				this.value = this.value + "\n";
			} else {
				sendMessage($userMessage.val());
				$userMessage.val("");
			}
		}
	});

	$(".dropImage")
		.bind("dragenter", dragImageEnter)
		.bind("dragleave", dragImageLeave)
		.bind("dragover", dragImageOver)
		.bind("drop", dropImage);

	function dragImageEnter(e){
		e.preventDefault();
		e.stopPropagation();
		$(this).addClass("glow");
	}

	function dragImageLeave(e){
		e.preventDefault();
		e.stopPropagation();
		$(this).removeClass("glow");
	}
	function dragImageOver(e){
		e.preventDefault();
		e.stopPropagation();
	}

	function dropImage(e){
		e.preventDefault();
		e.stopPropagation();
		var dt = e.dataTransfer;
		var image = dt.files[0];
		uploadImage(image);
		$(this).removeClass("glow");
	}

	function uploadImage(image){
		var xhr = new XMLHttpRequest();
		var reader = new FileReader();
		//Prepare POST request
		xhr.upload.addEventListener("load", function(e){
			console.log("finished");
		});
		xhr.upload.addEventListener("progress", function(e){
			console.log(e.total, e.loaded);
		});
		xhr.open("POST", apiUrl + "/users/upload");
		xhr.setRequestHeader("Content-Type", image.type);

		// TODO: add progress

		// when file is read
		reader.onload = function(rEvent){
			// upload file as binary to the server
			xhr.send(rEvent.target.result);
		};
		// start reading file
		reader.readAsArrayBuffer(image);
	}
})(Zepto, window, document);
