import React from "react";
import List from "./List";
import { sampleClassRef } from "../db";
import CreateFunctionBar from "./CreateFunctionBar";

class CreateCollectionView extends React.Component {

    state = {
        callList: [],
        collectionList: [],
        alerts: [],
        collectionNames: []
    }

    componentDidMount() {
        this.fetchAllCalls();
        this.fetchCollectionNames();
    }

    fetchAllCalls() {
        sampleClassRef.collection("AllCalls").get().then((snapshot) => {
            const allCalls = [];
            snapshot.forEach(((doc) => {
                allCalls.push(doc.data().displayData);
            }));
            allCalls.sort((a,b) => this.compareCalls(a,b));
            this.setState({ callList: allCalls });
        });
    }

    fetchCollectionNames() {
        sampleClassRef.collection("Collections").get().then((snapshot) => {
            var collectionNames = [];
            snapshot.forEach(((doc) => {
                collectionNames.push(doc.data().name);
            }));
            const collectionsExist = (collectionNames.length > 0);
            this.setState({collectionNames, collectionsExist});

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
            if (index >= 0) {
                collectionList.push(callList[index]);
                callList.splice(index, 1);
            }
        } else {
            const index = collectionList.findIndex((call) => call.name === name);
            if (index >= 0) {
                callList.push(collectionList[index]);
                collectionList.splice(index,1);
            }
        }
        callList.sort((a,b) => this.compareCalls(a,b));
        collectionList.sort((a,b) => this.compareCalls(a,b));
        this.setState({callList, collectionList});
    }

    addAllUsed = (e) => {
        e.preventDefault();
        console.log("Add all used");
    }

    addCollection = (name) => {
        const collectionsRef = sampleClassRef.collection("Collections");
        collectionsRef.where("name", "==", name).get().then((colSnapshot) => {
            collectionsRef.doc(colSnapshot.docs[0].id).collection("Calls").get().then((snapshot) => {
                snapshot.forEach(((doc) => {
                    this.moveCall(doc.data().displayData.name, "collectionList");
                }));
            });
        });
    }

    removeAll = () => {
        const collectionList = this.state.collectionList.slice(0);
        collectionList.forEach((call) => this.moveCall(call.name, "callList"));
    }

    saveCollection = async (name) => {
        if (!name) {
            this.showAlert("alert-warning", "Please name your collection");
        } else if (this.state.collectionList.length === 0) {
            this.showAlert("alert-warning", "Please add some calls to your collection");
        } else {
            await sampleClassRef.collection("Collections").where("name", "==", name).get().then((snapshot) => {
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
                    this.removeAll();
                    this.fetchCollectionNames();
                    return true;
                }
            })
        }
        return false;
    }

    showAlert(type, text) {
        const alerts = [{type: type, text: text}];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
    }

    render() {
        const alerts = this.state.alerts.map((alert) => 
            <div className={`alert ${alert.type} m-2`} role="alert" key={alert.text}>
                <span className="mr-auto">
                    {alert.text}
                </span>
                <button type="button" className="close" aria-label="Close" onClick={this.clearAlerts}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
        return (
            <div>
                <CreateFunctionBar 
                    addAllUsed={(e) => this.addAllUsed(e)}
                    removeAll={(e) => this.removeAll(e)}
                    saveCollection={(name) => this.saveCollection(name)}
                    addCollection={(name) => this.addCollection(name)}
                    collectionNames={this.state.collectionNames}
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
