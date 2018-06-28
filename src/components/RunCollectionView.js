import React from "react";
import List from "./List";
import { sampleClassRef } from "../db";
import RunFunctionBar from "./RunFunctionBar";

class RunCollectionView extends React.Component {

    state = {
        collectionCalls: [],
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
                const displayData = doc.data().displayData;
                displayData["used"] = false;
                allCalls.push(displayData);
            }));
            allCalls.sort((a,b) => this.compareCalls(a,b));
            this.setState({ collectionCalls: allCalls });
        });
    }

    fetchCollectionNames() {
        sampleClassRef.collection("Collections").get().then((snapshot) => {
            var collectionNames = [];
            snapshot.forEach(((doc) => {
                collectionNames.push(doc.data().name);
            }));
            this.setState({collectionNames});

        });
    }

    finishCollection(e) {
        e.preventDefault();
        console.log("finish Collection");
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

    toggleCall(name) {
        var collectionCalls = this.state.collectionCalls;
        const index = collectionCalls.findIndex((call) => call.name === name);
        if (index >= 0) {
            const call = collectionCalls[index];
            call.disabled = !call.disabled;
            collectionCalls[index] = call;
            this.setState({collectionCalls});
        }
    }

    showAlert(type, text) {
        const alerts = [{type: type, text: text}];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
    }

    selectActiveCollection = (name) => {
        console.log(`Selected Collection: ${name}`)
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
                    finishCollection={(e) => this.finishCollection(e)}
                    collectionNames={this.state.collectionNames}
                    activeCollection={this.state.activeCollection}
                    sortBy={this.state.sortBy}
                    activeGroup={this.state.activeGroup}
                    selectActiveCollection={(collection) => this.selectActiveCollection(collection)}
                    selectSortMethod={(sort) => this.selectSortMethod(sort)}
                    selectActiveGroup={(group) => this.selectActiveGroup(group)}
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
