import React from "react";
import List from "./List";
import { sampleClassRef } from "../db";
import RunFunctionBar from "./RunFunctionBar";

class RunCollectionView extends React.Component {

    state = {
        collectionCalls: [],
        alerts: []
    }

    toggleCall(name) {
        console.log(name);
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
                <RunFunctionBar />
                {alerts}
                <div className="row">
                    <List size="col-md-12" calls={this.state.collectionCalls} onClick={(name) => this.toggleCall(name)} />
                </div>
            </div>
        )
    }

}

export default RunCollectionView;
