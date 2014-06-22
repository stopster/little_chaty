define(["react"], function(React){
	var Message = React.createClass({
		render: function(){
			return (
				<div className="chat-message">
					<span className="time">{this.props.data.time}</span>
					<span className="user-name">{this.props.data.userName}</span>
					<span className="message-text">{this.props.data.text}</span>
				</div>
			);
		}
	});

	return Message;
});