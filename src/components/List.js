import React from "react";
import Call from "./Call";

class List extends React.Component {

    state = {
        calls: [
            {id: 0, name: "Call 1", nickname: "C1", group: 1, level: 0 },
            {id: 1, name: "Call 2", nickname: "C2", group: 2, level: 0 },
            {id: 2, name: "Call 3", nickname: "C3", group: 3, level: 2 },
            {id: 3, name: "Call 4", nickname: "C4", group: 4, level: 2 },
            {id: 4, name: "Call 5", nickname: "C5", group: 3, level: 1 },
            {id: 5, name: "Call 6", nickname: "C6", group: 1, level: 1 },
            {id: 6, name: "Call 6", nickname: "C6", group: 1, level: 0 },
            {id: 7, name: "Call 7", nickname: "C7", group: 4, level: 0 },
            {id: 8, name: "Call 8", nickname: "C8", group: 3, level: 1 },
            {id: 9, name: "Call 9", nickname: "C9", group: 4, level: 2 },
            {id: 10, name: "Call 10", nickname: "C10", group: 2, level: 2 },
            {id: 11, name: "Call 11", nickname: "C11", group: 3, level: 1 },
        ]
    }

    render() {
        return (
            <ul className={`list-group ${this.props.size}`}>
                {this.state.calls.map(call => <Call {...call} key={call.id} onClick={() => {console.log(call.id);}} />)}
            </ul>
        )
    }

}

export default List;