import React from "react";
import ReviewFunctionBar from "./ReviewFunctionBar";
import * as db from "../util/dbfunctions";
import List from "./List";
import Modal from "./Modal";

class ReviewClassView extends React.Component {

    state = {
        alerts: [],
        selectedCalls: [],
        collectionNames: []
    }

    componentDidMount() {
        this.loadAllCalls();
        this.loadCollectionNames();

    }

    loadAllCalls = async () => {
        db.fetchAllCalls().then((allCalls) => {
            allCalls.sort((a, b) => this.compareCalls(a, b));
            this.setState({ selectedCalls: allCalls });
        });
    }

    async loadCollectionNames() {
        db.fetchCollectionNames().then((collectionNames) => { this.setState({ collectionNames }) });
    }

    showCall(name) {
        console.log(name);
    }

    showAlert(type, text) {
        const alerts = [{ type: type, text: text }];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
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

    selectSortMethod = (sort) => {
        console.log(`Selected Sort: ${sort}`);
    }

    selectActiveCollection = (name) => {
        console.log(`Selected Collection: ${name}`);
    }

    selectActiveGroup = (group) => {
        console.log(`Selected Group: ${group}`);
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
                <Modal calls={this.state.selectedCalls}/>
                <ReviewFunctionBar
                    collectionNames={this.state.collectionNames}
                    selectSortMethod={(sort) => this.selectSortMethod(sort)}
                    selectActiveCollection={(collection) => this.selectActiveCollection(collection)}
                    selectActiveGroup={(group) => this.selectActiveGroup(group)}
                />
                {alerts}
                <div className="row">
                    <List size="col-md-12" calls={this.state.selectedCalls} onClick={(name) => this.showCall(name)} />
                </div>
            </div>
        )
    }

}

export default ReviewClassView;
