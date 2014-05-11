var users = {};
exports.isLoggedIn = function(user){
	if(typeof user === "string"){
		user = {name: user};
	}
	if(users[user.name]){
		return true;
	} else {
		return false;
	}
};

exports.login = function(user){
	if(!user.name || users[user.name]){
		return false;
	}
	users[user.name] = user;
	return true;
};

exports.logout = function(userName){
	delete users[userName];
};

exports.get = function(userName, asArray){
	var output;
	if(!userName){
		if(asArray){
			var arrUsers = [];
			for(var name in users){
				if(users.hasOwnProperty(name)){
					arrUsers.push(users[name]);
				}
			}
			output = arrUsers;
		} else {
			output = users;
		}
	} else {
		output = users[userName];
	}
	return output;
};
