import React from "react";
import List from "./List";
import { sampleClassRef } from "../db";

class CreateCollectionView extends React.Component {

    state = {
        callList: [],
        collectionList: []
    }

    componentDidMount() {
        sampleClassRef.collection("AllCalls").get().then((snapshot) => {
            const allCalls = [];
            snapshot.forEach(((doc) => {
                allCalls.push(doc.data().displayData);
            }));
            allCalls.sort((a,b) => this.compareCalls(a,b));
            this.setState({ callList: allCalls });
        });
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
        var callList = this.state.callList;
        var collectionList = this.state.collectionList;

        if (destination === "collectionList") {
            const index = callList.findIndex((call) => call.name === name);
            collectionList.push(callList[index]);
            callList.splice(index, 1);
        } else {
            const index = collectionList.findIndex((call) => call.name === name);
            callList.push(collectionList[index]);
            collectionList.splice(index,1);
        }
        callList.sort((a,b) => this.compareCalls(a,b));
        collectionList.sort((a,b) => this.compareCalls(a,b));
        this.setState({callList, collectionList});
    }

    render() {
        return (
            <div className="row">
                <List size="col-md-6" calls={this.state.callList} onClick={(name) => this.moveCall(name, "collectionList")} />
                <List size="col-md-6" calls={this.state.collectionList} onClick={(name) => this.moveCall(name, "callList")} />
            </div>
        )
    }

}

export default CreateCollectionView;
