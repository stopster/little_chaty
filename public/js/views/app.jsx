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
        render: function(){
            return (
                <div className="container">
                    <h1>Plain chat</h1>            
                    <div className="col-xs-12">
                        <LoginForm className="col-xs-5 col-xs-offset-3"/>
                    </div>
                    <div className="chat-wrapper row">
                        <UserList className="col-xs-4 col-md-2"/>
                        <MessageList className="col-xs-8 col-md-10"/>
                        <MessageEditor className="col-xs-12" />
                    </div>
                </div>
            );
        }
    });

    return AppView;
});