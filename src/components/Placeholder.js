import React from "react";
import {NavLink} from "react-router-dom";

class Placeholder extends React.Component {

    render() {
        return (
            <div className="jumbotron placeholder">
                <h4 className="jumbo-heading">{this.props.content.title}</h4>
                <hr/>
                <h6 className="mt-2">{this.props.content.text}</h6>
                {this.props.content.rel ? <NavLink className={`btn btn-info`} to={this.props.content.rel}>{this.props.content.destination}</NavLink> : ""}
            </div>
        )
    }
}

export default Placeholder;