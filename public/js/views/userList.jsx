define(["react", "jsx!js/views/user"], function(React, User){
	var UserList = React.createClass({
		getInitialState: function(){
			var testUsers = [
				{name: "st"},
				{name: "st2"},
				{name: "st3"}
			];
			return {data: testUsers};
		},
		render: function(){
			var renderedUsers;
			if(this.state.data && this.state.data.length){
				renderedUsers = this.state.data.map(function(userData, index){
					return <User data={userData} key={index}/>;
				});
			} else {
				renderedUsers = <div className="no-users">Nobody is online</div>;
			}
			return (
	            <div className={"users-list " + this.props.className}>
	            	{renderedUsers}
	            </div>
	        );
		}
	});

	return UserList;
});