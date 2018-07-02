import React from "react";
import List from "./List";
import * as db from "../util/dbfunctions";
import CreateFunctionBar from "./CreateFunctionBar";

class CreateCollectionView extends React.Component {

    state = {
        callList: [],
        collectionList: [],
        alerts: [],
        collectionNames: []
    }

    componentDidMount() {
        this.loadAllCalls();
        this.loadCollectionNames();
    }

    loadAllCalls = async () => {
        db.fetchAllCalls().then((allCalls) => {
            allCalls.sort((a, b) => this.compareCalls(a, b));
            this.setState({ callList: allCalls });
        });
    }

    async loadCollectionNames() {
        db.fetchCollectionNames().then((collectionNames) => { this.setState({ collectionNames }) });
    }

    compareCalls(a, b) {
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
                collectionList.splice(index, 1);
            }
        }
        callList.sort((a, b) => this.compareCalls(a, b));
        collectionList.sort((a, b) => this.compareCalls(a, b));
        this.setState({ callList, collectionList });
    }

    addAllUsed = (e) => {
        e.preventDefault();
        console.log("Add all used");
    }

    async addCollection(name) {
        db.fetchCollectionCalls(name).then((collectionCalls) => {
            collectionCalls.forEach(((call) => {
                this.moveCall(call.name, "collectionList");
            }));
        });
    }

    removeAll = () => {
        const collectionList = this.state.collectionList.slice(0);
        collectionList.forEach((call) => this.moveCall(call.name, "callList"));
    }

    async saveNewCollection(name) {
        if (!name) {
            this.showAlert("alert-warning", "Please name your collection");
        } else if (this.state.collectionList.length === 0) {
            this.showAlert("alert-warning", "Please add some calls to your collection");
        } else {
            const collection = await db.findCollection(name);
            if (collection) {
                this.showAlert("alert-warning", "A collection with that name already exists");
            } else {
                const collectionCalls = this.state.collectionList.map((call) => ({ displayData: call, used: false, timestamp: Date.now() }));
                await db.setCollection(name, collectionCalls);
                this.showAlert("alert-success", "Collection saved");
                this.removeAll();
                this.loadCollectionNames();
                return true;
            }
        }
        return false;
    }

    showAlert(type, text) {
        const alerts = [{ type: type, text: text }];
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
                    saveNewCollection={(name) => this.saveNewCollection(name)}
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
