import React from "react";
import PropTypes from "prop-types";

class Call extends React.Component {

    static propTypes = {
        name: PropTypes.string,
        group: PropTypes.number,
        onClick: PropTypes.func
    }

    render() {
        return (
            <li className="list-group-item btn btn-outline-secondary" onClick={this.props.onClick}>{this.props.name}</li>
        )
    }

}

export default Call;
