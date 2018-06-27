import React from "react";
import Call from "./Call";
import PropTypes from "prop-types";

class List extends React.Component {

     static propTypes = {
        calls: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            group: PropTypes.number
        })),
        onClick: PropTypes.func,
        size: PropTypes.string
    }

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