import React from "react";
import Call from "./Call";

class List extends React.Component {

    render() {
        const listItems = this.props.calls.map(call => <Call {...call} key={call.name} onClick={() => this.props.onClick(call.name)} />);
        return (
            <ul className={`list-group ${this.props.size}`}>
                {listItems}
            </ul>
        )
    }

}

export default List;