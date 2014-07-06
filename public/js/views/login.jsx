/** @jsx React.DOM */
define(["react", "jquery", "underscore"], function(React, $, _){
	var Login = React.createClass({
        getInitialState: function(){
            return { isNameChecked: false };
        },
        onLogin: function(){
            var userName = this.refs.name.state.value;
            var model = this.props.model;
            if(this.state.isNameAvailable){
                model.set("name", userName);
                model.set("sex", this.state.sex);
                model.login();
            }
        },
        onNameTyping: _.debounce(function(e){
            var name = this.refs.name.state.value;
            if(name){
                this.props.model.isNameAvailable(name, function(isAvailable){
                    this.setState({ isNameChecked: true, isNameAvailable: isAvailable });
                }.bind(this));
            } else {
                this.setState({ isNameChecked: false });
            }
        }, 400),
        onNameChanged: function(){
            this.setState({
                isNameChecked: false
            });
        },
        onSexSelected: function(e){
            $(e.target).addClass("active").siblings().removeClass("active");
            this.setState({
                sex: $(e.target.hasClass("male"))? "male": "female"
            });
        },
		render: function(){
            if(this.state.isNameChecked){
                var nameFieldSign = <span className={"glyphicon glyphicon-" + (this.state.isNameAvailable? "ok": "warning-sign")}></span>;
            }
			return (
                <div className={"login-form " + this.props.className}>
                    <div className="avatar-wrapper">
                        <div className="drop-avatar">
                            <img src="/images/basic-avatar.png"/>
                        </div>
                    </div>
                    <div className="login-name-wrap">
                        <input className="form-control" type="text" placeholder="your name" ref="name" onChange={this.onNameChanged} onKeyDown={this.onNameTyping}/>
                        {nameFieldSign} 
                    </div>
                    <div className="row">
                        <div className="sex-buttons button-group col-xs-8">
                            <button className="btn btn-default btn-sm male" type="button" ref="sex-male" onClick={this.onSexSelected}>male</button>
                            <button className="btn btn-default btn-sm female" type="button" ref="sex-female" onClick={this.onSexSelected}>female</button>
                        </div>                        
                        <div className="col-xs-4">
                            <button className="btn btn-primary start-chat" type="button" onClick={this.onLogin}>Chat!</button>
                        </div>
                    </div>    
                </div>
			);
		}
	});

	return Login;
})