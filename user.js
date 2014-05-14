var usersLoggedIn = {};
var ee = require("events").EventEmitter;

function User(){
	ee.call(this);
}

User.prototype = ee.prototype;
User.prototype.isLoggedIn = function(user){
	if(typeof user === "object" && user.name){
		user = user.name;
	}
	if(usersLoggedIn[user]){
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

User.prototype.get = function(userName, asArray){
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

// Copy user object without id and other secure information
User.prototype.safe = function(user){
	var safeUser = {};
	safeUser.name = user.name;
	safeUser.sex = user.sex;
	return safeUser;
}

exports.User = new User();
