import React from "react";

class Call extends React.Component {

    render() {
        return (
            <li className="list-group-item btn btn-outline-secondary" onClick={this.props.onClick}>{this.props.nickname}</li>
        )
    }

}

export default Call;
