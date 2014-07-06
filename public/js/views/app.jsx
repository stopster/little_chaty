/** @jsx React.DOM */
define([
        "react",
        "jsx!js/views/login",
        "jsx!js/views/userList",
        "jsx!js/views/messageList",
        "jsx!js/views/messageEditor"
    ], function(
        React,
        LoginForm,
        UserList,
        MessageList,
        MessageEditor
    ){
    var AppView = React.createClass({
        getInitialState: function(){
            return {
                showLoader: true
            };
        },
        componentDidMount: function(){
            var activeUser = this.props.model.createActiveUser();
            this.props.model.listenTo(activeUser, "authenticated", function(user){
                this.setState({
                    activeUser: user,
                    showLoader: false
                })
            }.bind(this));
            activeUser.authenticate();

            this.props.model.listenTo(activeUser, "startAction", function(){
                this.setState({
                    showLoader: true
                });
            }.bind(this));
        },
        render: function(){
            var content = null;
            if(this.state.showLoader){
                content = <div className="loader-wrap"><div className="loader"></div></div>;
            } else if(this.state.activeUser.get("authenticated")){
                content = (
                    <div className="chat-wrapper row">
                        <UserList className="col-xs-4 col-md-2"/>
                        <MessageList className="col-xs-8 col-md-10"/>
                        <MessageEditor className="col-xs-12" />
                    </div>
                );
            } else {
                content = (
                    <div className="col-xs-12">
                        <LoginForm model={this.state.activeUser} className="col-xs-12 col-md-5 col-md-offset-3"/>
                    </div>
                );
            }
            // Page main layout :)
            return (
                <div className="container">
                    <h1>Plain chat</h1>
                    {content}
                </div>
            );
        }
    });

    return AppView;
});