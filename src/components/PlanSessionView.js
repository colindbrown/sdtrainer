import React from "react";
import List from "./List";
import Alerts from "./Alerts";
import * as db from "../util/dbfunctions";
import PlanFunctionBar from "./PlanFunctionBar";

class PlanSessionView extends React.Component {

    state = {
        callList: [],
        sessionList: [],
        alerts: [],
        sessionNames: []
    }

    // Lifecycle methods
    componentDidMount() {
        this.loadAllCalls();
        this.loadSessionNames();
    }

    // Async methods
    async loadAllCalls() {
        db.fetchAllCalls().then((allCalls) => {
            allCalls.sort((a, b) => this.compareCalls(a, b));
            this.setState({ callList: allCalls });
        });
    }

    async loadSessionNames() {
        db.fetchSessionNames().then((sessionNames) => { this.setState({ sessionNames }) });
    }

    async addSession(name) {
        db.fetchSessionCalls(name).then(async (sessionCalls) => {
            const displayData = await db.displayData(sessionCalls);
            displayData.forEach(((call) => {
                this.moveCall(call.name, "sessionList");
            }));
        });
    }

    async saveNewSession(name) {
        if (!name) {
            this.showAlert("alert-warning", "Please name your session");
        } else if (this.state.sessionList.length === 0) {
            this.showAlert("alert-warning", "Please add some calls to your session");
        } else {
            const session = await db.fetchSessionRef(name);
            if (session) {
                this.showAlert("alert-warning", "A session with that name already exists");
            } else {
                const sessionCalls = this.state.sessionList.map((call) => ({ name: call.name, used: false, timestamp: Date.now() }));
                await db.setSession(name, sessionCalls);
                this.showAlert("alert-success", "Session saved");
                this.removeAll();
                this.loadSessionNames();
                return true;
            }
        }
        return false;
    }

    // Helper methods
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
        var sessionList = this.state.sessionList;

        if (destination === "sessionList") {
            const index = callList.findIndex((call) => call.name === name);
            if (index >= 0) {
                sessionList.push(callList[index]);
                callList.splice(index, 1);
            }
        } else {
            const index = sessionList.findIndex((call) => call.name === name);
            if (index >= 0) {
                callList.push(sessionList[index]);
                sessionList.splice(index, 1);
            }
        }
        callList.sort((a, b) => this.compareCalls(a, b));
        sessionList.sort((a, b) => this.compareCalls(a, b));
        this.setState({ callList, sessionList });
    }

    showAlert(type, text) {
        const alerts = [{ type: type, text: text }];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
    }

    // Props methods
    addAllUsed = async (e) => {
        e.preventDefault();
        db.fetchByEverUsed(true).then(async (calls) => {
            const displayData = await db.displayData(calls);
            displayData.forEach(((call) => {
                this.moveCall(call.name, "sessionList");
            }));
        })
    }

    removeAll = () => {
        const sessionList = this.state.sessionList.slice(0);
        sessionList.forEach((call) => this.moveCall(call.name, "callList"));
    }

    render() {
        return (
            <div>
                <PlanFunctionBar
                    addAllUsed={(e) => this.addAllUsed(e)}
                    removeAll={(e) => this.removeAll(e)}
                    saveNewSession={(name) => this.saveNewSession(name)}
                    addSession={(name) => this.addSession(name)}
                    sessionNames={this.state.sessionNames}
                />
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <div className="row">
                    <List size="col-md-6" id="callList" columns={2} calls={this.state.callList} onClick={(name) => this.moveCall(name, "sessionList")} />
                    <List size="col-md-6" id="sessionList" columns={2} calls={this.state.sessionList} onClick={(name) => this.moveCall(name, "callList")} />
                </div>
            </div>
        )
    }

}

export default PlanSessionView;
