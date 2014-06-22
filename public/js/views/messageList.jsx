define(["react", "jsx!js/views/message"], function(React, Message){
	var MessageList = React.createClass({
		getInitialState: function(){
			return {data: [{
					id: 0,
					userName: "st2",
					time: new Date().toString().match(/(\d\d\:\d\d)/)[0],
					text: "Hello! this is test message!"
				}
			]};
		},
		render: function(){
			var messages = this.state.data.map(function(messageData){
				return <Message data={messageData} key={messageData.id}/>;
			});
			return <div className={"chat-window " + this.props.className}>{messages}</div>;
		}
	});

	return MessageList;
});