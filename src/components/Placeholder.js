import React from "react";

class Placeholder extends React.Component {

    render() {
        return (
            <div className="jumbotron placeholder">
                <h4 className="jumbo-heading">{this.props.content.title}</h4>
                <hr/>
                <h6 className="mt-2">{this.props.content.text}</h6>
            </div>
        )
    }
}

export default Placeholder;