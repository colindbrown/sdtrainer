import React from "react";
import List from "./List";
import { sampleClassRef } from "../db";
import CreateFunctionBar from "./CreateFunctionBar";

class CreateCollectionView extends React.Component {

    state = {
        callList: [],
        collectionList: [],
        alerts: []
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

    addAllUsed = (e) => {
        e.preventDefault();
        console.log("Add all used");
    }

    removeAll = (e) => {
        e.preventDefault();
        console.log("Remove all");
    }

    saveCollection = (name) => {
        if (!name) {
            this.showAlert("alert-warning", "Please name your collection");
        } else if (this.state.collectionList.length === 0) {
            this.showAlert("alert-warning", "Please add some calls to your collection");
        } else {
            sampleClassRef.collection("Collections").where("name", "==", name).get().then((snapshot) => {
                if (snapshot.size > 0) {
                    this.showAlert("alert-warning", "A collection with that name already exists");
                } else {
                    const newCollection = sampleClassRef.collection("Collections").doc()
                    newCollection.set({
                        name: name
                    })
                    this.state.collectionList.forEach((call) => {
                        newCollection.collection("Calls").add({
                            displayData: call,
                            used: false
                        })
                    })
                    this.showAlert("alert-success", "Collection saved");
                }
            })
        }
    }

    showAlert(type, text) {
        const alerts = [{type: type, text: text}];
        this.setState({ alerts });
    }

    render() {
        const alerts = this.state.alerts.map((alert) => 
            <div className={`alert ${alert.type} m-2`} role="alert" key={alert.text}>
                {alert.text}
            </div>
        );
        return (
            <div>
                <CreateFunctionBar 
                    addAllUsed={(e) => this.addAllUsed(e)}
                    removeAll={(e) => this.removeAll(e)}
                    saveCollection={(name)=>this.saveCollection(name)}
                />
                {alerts}
                <div className="row">
                    <List size="col-md-6" calls={this.state.callList} onClick={(name) => this.moveCall(name, "collectionList")} />
                    <List size="col-md-6" calls={this.state.collectionList} onClick={(name) => this.moveCall(name, "callList")} />
                </div>
            </div>
        )
    }

}

export default CreateCollectionView;
