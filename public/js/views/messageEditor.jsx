define(["react"], function(React){
	var Editor = React.createClass({
		render: function(){
			return (
                <div className={"type-message-wrap " + this.props.className }>
                    <div className="type-message col-xs-10" contentEditable>My message</div>
                    <div className="send-wrap col-xs-2">
                        <button className="btn btn-primary">send!</button>
                    </div>
                </div>
			);
		}
	});

	return Editor;
});