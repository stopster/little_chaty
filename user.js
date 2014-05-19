var usersLoggedIn = {};
var ee = require("events").EventEmitter;

function User(){
	ee.call(this);
}

User.prototype = ee.prototype;
User.prototype.isLoggedIn = function(user){
	if(!user){
		return false;
	}
	var userName = user.name? user.name: user;
	if(usersLoggedIn[userName]){
		return true;
	} else {
		return false;
	}
};
User.prototype.login = function(user){
	if(!user.name || usersLoggedIn[user.name]){
		return false;
	}
	usersLoggedIn[user.name] = user;
	this.emit("login", user);
	return true;
};

User.prototype.logout = function(deleteBy, silent){
	var loggedOutName;
	// Find user by ID
	if(deleteBy.id){
		for(var name in usersLoggedIn){
			if(usersLoggedIn.hasOwnProperty(name)){
				if(usersLoggedIn[name].id == deleteBy.id){
					loggedOutName = name;
					break;
				}
			}
		}
		// else, check user name
	} else if(deleteBy.name && usersLoggedIn[deleteBy.name]){
		loggedOutName = deleteBy.name;
	}

	if(loggedOutName){
		if(!silent){
			this.emit("logout", usersLoggedIn[loggedOutName]);
		}
		delete usersLoggedIn[loggedOutName];
		return true;
	} else {

		return false;
	}
};

User.prototype.get = function(userName, returnSafe){
	var output;
	if(!userName){
		output = [];
		for(var name in usersLoggedIn){
			if(usersLoggedIn.hasOwnProperty(name)){
				output.push(returnSafe? this.safe(usersLoggedIn[name]): usersLoggedIn[name]);
			}
		}
	} else {
		output = returnSafe? this.safe(usersLoggedIn[userName]): usersLoggedIn[userName];
	}
	return output;
};

User.prototype.getById = function(id, returnSafe){
	if(!id){
		return null;
	}
	for(var name in usersLoggedIn){
		if(usersLoggedIn.hasOwnProperty(name)){
			var user = usersLoggedIn[name];
			if(user.id === id){
				return returnSafe? User.safe(user): user;
			}
		}
	}
	return null;
}

User.prototype.attachFile = function(user, imageUrl){
	usersLoggedIn[user.name].imageUrl = imageUrl;
}

// Copy user object without id and other secure information
User.prototype.safe = function(user){
	if(!user){
		return;
	}
	var safeUser = {
		name: user.name,
		sex: user.sex,
		imageUrl: user.imageUrl
	};
	return safeUser;
};

exports.User = new User();
