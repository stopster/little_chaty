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

User.prototype.logout = function(userName, silent){
	if(!silent){
		this.emit("logout", usersLoggedIn[userName]);
	}
	delete usersLoggedIn[userName];
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

exports.User = new User();
