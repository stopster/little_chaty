/** @jsx React.DOM */
define(["react"], function(React){
	var Login = React.createClass({
        login: function(){
            var userName = this.refs.name.state.value;
            this.props.model.set("name", userName);
            this.props.model.login(function(){
                console.log("logged in");
            }, function(){
                console.log("error in login");
            });
        },
		render: function(){
			return (
                <div className={"login-form " + this.props.className}>
                    <div className="avatar-wrapper">
                        <div className="drop-avatar">
                            <img src="/images/basic-avatar.png"/>
                        </div>
                    </div>
                    <input className="form-control" type="text" placeholder="your name" ref="name"/>
                    <div className="row">
                        <div className="sex-buttons button-group col-xs-6">
                            <button className="btn btn-default btn-sm male" type="button" ref="sex-male">male</button>
                            <button className="btn btn-default btn-sm female" type="button" ref="sex-female">female</button>
                        </div>                        
                        <div className="col-xs-6">
                            <button className="btn btn-primary start-chat" type="button" onClick={this.login}>Chat!</button>
                        </div>
                    </div>    
                </div>
			);
		}
	});

	return Login;
})