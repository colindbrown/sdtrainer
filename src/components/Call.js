import React from "react";
import PropTypes from "prop-types";

class Call extends React.Component {

    static propTypes = {
        name: PropTypes.string,
        group: PropTypes.number,
        disabled: PropTypes.bool,
        onClick: PropTypes.func
    }

    render() {
        const disabled = this.props.disabled ? "list-group-item-dark" : "btn btn-outline-secondary";
        return (
            <li data-toggle="modal" data-target="#exportModal" className={`list-group-item ${disabled}`} onClick={this.props.onClick}>{this.props.name}</li>
        )
    }

}

export default Call;
