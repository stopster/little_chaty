/** @jsx React.DOM */
define(["react"], function(React){
	var Login = React.createClass({
		render: function(){
			return (
                <div className={"login-form " + this.props.className}>
                    <div className="avatar-wrapper">
                        <div className="drop-avatar">
                            <img src="/images/basic-avatar.png"/>
                        </div>
                    </div>
                    <input className="form-control" type="text" placeholder="your name"/>
                    <div className="row">
                        <div className="sex-buttons button-group col-xs-6">
                            <button className="btn btn-default btn-sm male" type="button">male</button>
                            <button className="btn btn-default btn-sm female" type="button">female</button>
                        </div>                        
                        <div className="col-xs-6">
                            <button className="btn btn-primary start-chat" type="button">Chat!</button>
                        </div>
                    </div>    
                </div>
			);
		}
	});

	return Login;
})