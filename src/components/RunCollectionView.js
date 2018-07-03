import React from "react";
import List from "./List";
import * as db from "../util/dbfunctions";
import RunFunctionBar from "./RunFunctionBar";

class RunCollectionView extends React.Component {

    state = {
        collectionCalls: [],
        alerts: [],
        collectionNames: [],
        activeCollection: ""
    }


    componentDidMount() {
        this.loadCollectionNames();
    }

    async loadCollection(name) {
        db.fetchCollectionCalls(name).then( async (collectionCalls) => {
            const displayData = await db.displayData(collectionCalls);
            collectionCalls.forEach(((call) => {
                call.disabled = false;
                call.timestamp = Date.now();
                call.group = displayData.find((iterator) => (iterator.name === call.name)).group;
            }));
            collectionCalls.sort((a, b) => this.compareCalls(a, b));
            this.setState({ collectionCalls: collectionCalls, activeCollection: name });
        });
    }

    async loadCollectionNames() {
        db.fetchCollectionNames().then((collectionNames) => { this.setState({ collectionNames }) });
    }

    finishCollection(e) {
        e.preventDefault();
        const collectionUpdate = this.state.collectionCalls.map((call) => ({ name: call.name, used: call.disabled, timestamp: call.timestamp}));
        db.setCollection(this.state.activeCollection, collectionUpdate);
        const historyUpdate = this.state.collectionCalls.map((call) => ({ name: call.name, everUsed: call.disabled, uses: [call.timestamp] }));
        db.updateHistory(historyUpdate);
        this.setState({ activeCollection: "", collectionCalls: [] });
        this.showAlert("alert-success", "Collection saved");
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

    toggleCall(name) {
        var collectionCalls = this.state.collectionCalls;
        const index = collectionCalls.findIndex((call) => call.name === name);
        if (index >= 0) {
            const call = collectionCalls[index];
            call.disabled = !call.disabled;
            call.timestamp = Date.now();
            collectionCalls[index] = call;
            this.setState({ collectionCalls });
        }
    }

    showAlert(type, text) {
        const alerts = [{ type: type, text: text }];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
    }

    selectActiveCollection = (name) => {
        this.loadCollection(name);
    }

    selectSortMethod = (sort) => {
        console.log(`Selected Sort: ${sort}`)
    }

    selectActiveGroup = (group) => {
        console.log(`Selected Group: ${group}`)
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
                <RunFunctionBar
                    collectionNames={this.state.collectionNames}
                    activeCollection={this.state.activeCollection}
                    sortBy={this.state.sortBy}
                    activeGroup={this.state.activeGroup}
                    selectActiveCollection={(collection) => this.selectActiveCollection(collection)}
                    selectSortMethod={(sort) => this.selectSortMethod(sort)}
                    selectActiveGroup={(group) => this.selectActiveGroup(group)}
                    finishCollection={(e) => this.finishCollection(e)}
                />
                {alerts}
                <div className="row">
                    <List size="col-md-12" calls={this.state.collectionCalls} onClick={(name) => this.toggleCall(name)} />
                </div>
            </div>
        )
    }

}

export default RunCollectionView;
