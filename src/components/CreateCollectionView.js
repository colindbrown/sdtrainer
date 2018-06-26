import React from "react";
import List from "./List";

class CreateCollectionView extends React.Component {

    state = {
        group1: [
            {name: "Call 0", nickname: "C0", group: 1, level: 0 },
            {name: "Call 1", nickname: "C1", group: 2, level: 0 },
            {name: "Call 2", nickname: "C2", group: 3, level: 2 },
            {name: "Call 3", nickname: "C3", group: 4, level: 2 },
            {name: "Call 4", nickname: "C4", group: 3, level: 1 },
            {name: "Call 5", nickname: "C5", group: 1, level: 1 }
        ],
        group2: [
            {name: "Call 6", nickname: "C6", group: 1, level: 0 },
            {name: "Call 7", nickname: "C7", group: 4, level: 0 },
            {name: "Call 8", nickname: "C8", group: 3, level: 1 },
            {name: "Call 9", nickname: "C9", group: 4, level: 2 },
            {name: "Call 10", nickname: "C10", group: 2, level: 2 },
            {name: "Call 11", nickname: "C11", group: 3, level: 1 }
        ]
    }

    compareCalls(a,b) {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    }

    moveCall = (name, destination) => {
        var group1 = this.state.group1;
        var group2 = this.state.group2;

        if (destination === "group2") {
            const index = group1.findIndex((call) => call.name === name);
            group2.push(group1[index]);
            group1.splice(index, 1);
        } else {
            const index = group2.findIndex((call) => call.name === name);
            group1.push(group2[index]);
            group2.splice(index,1);
        }
        group1.sort((a,b) => this.compareCalls(a,b));
        group2.sort((a,b) => this.compareCalls(a,b));
        this.setState({group1, group2});
    }

    render() {
        return (
            <div className="row">
                <List size="col-md-6" calls={this.state.group1} onClick={(name) => this.moveCall(name, "group2")} />
                <List size="col-md-6" calls={this.state.group2} onClick={(name) => this.moveCall(name, "group1")} />
            </div>
        )
    }

}

export default CreateCollectionView;
