import React from "react";

class Call extends React.Component {

    render() {
        var styling = "";
        if (this.props.empty) {
            styling = "disabled list-group-item-light call-empty";
        } else if (this.props.disabled) {
            styling = "list-group-item-dark";
        } else {
            styling = `btn-outline-light group-${this.props.group}`;
        }
        return (
            <li 
            data-toggle="modal" 
            data-target="#exportModal" 
            className={`btn list-group-flush list-group-item call ${styling} `} 
            onClick={this.props.onClick}>
                <span className={this.props.empty ? "empty" : ""}>{this.props.name}</span>
            </li>
        )
    }

}

export default Call;
