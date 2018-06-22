import React from "react";

class Call extends React.Component {

    render() {
        return (
            <li className="list-group-item" >{this.props.name}</li>
        )
    }

}

export default Call;
