import React from "react";

class Call extends React.Component {

    render() {
        const disabled = this.props.disabled ? "list-group-item-dark" : "btn btn-outline-secondary";
        return (
            <li data-toggle="modal" data-target="#exportModal" className={`list-group-item ${disabled}`} onClick={this.props.onClick}>{this.props.name}</li>
        )
    }

}

export default Call;
