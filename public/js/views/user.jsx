define(["react"], function(React){
	var User = React.createClass({
		render: function(){
			return (
                <div className="user">
                    <img src="/images/basic-avatar.png"/>
                    <span className="name" key={this.props.id}>{this.props.data.name}</span>
                </div>
			);
		}
	});
	return User;
});