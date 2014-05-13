var usersLoggedIn = {};
var usersInChat = [];
exports.isLoggedIn = function(user){
	if(typeof user === "string"){
		user = {name: user};
	}
	if(usersLoggedIn[user.name]){
		return true;
	} else {
		return false;
	}
};

exports.addToChat = function(user){
	usersInChat.push(user);
};

exports.removeFromChat = function(user){
	usersInChat.splice(usersInChat.indexOf(user), 1);
};

exports.login = function(user){
	if(!user.name || usersLoggedIn[user.name]){
		return false;
	}
	usersLoggedIn[user.name] = user;
	return true;
};

exports.logout = function(userName){
	delete usersLoggedIn[userName];
};

exports.get = function(userName, asArray){
	var output;
	if(!userName){
		if(asArray){
			var arrUsers = [];
			for(var name in usersLoggedIn){
				if(usersLoggedIn.hasOwnProperty(name)){
					arrUsers.push(usersLoggedIn[name]);
				}
			}
			output = arrUsers;
		} else {
			output = usersLoggedIn;
		}
	} else {
		output = usersLoggedIn[userName];
	}
	return output;
};
