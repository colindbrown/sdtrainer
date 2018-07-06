import React from "react";

class Call extends React.Component {

    render() {
        const styling = this.props.empty ? "btn disabled list-group-item-light" : this.props.disabled ? "btn list-group-item-dark" : "btn btn-outline-secondary list-group-flush";
        return (
            <li data-toggle="modal" data-target="#exportModal" className={`list-group-item ${styling}`} onClick={this.props.onClick}><span className={this.props.empty ? "empty" : ""}>{this.props.name}</span></li>
        )
    }

}

export default Call;
