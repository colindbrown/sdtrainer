import React from "react";
import List from "./List";
import Alerts from "./Alerts";
import * as db from "../util/dbfunctions";
import RunFunctionBar from "./RunFunctionBar";

class RunSessionView extends React.Component {

    state = {
        sessionCalls: [],
        alerts: [],
        sessionNames: [],
        activeSession: "",
        sort: ""
    }


    componentDidMount() {
        this.loadSessionNames();
    }

    async loadSession(name) {
        db.fetchSessionCalls(name).then( async (sessionCalls) => {
            const displayData = await db.displayData(sessionCalls);
            sessionCalls.forEach(((call) => {
                call.disabled = false;
                call.timestamp = Date.now();
                call.group = displayData.find((iterator) => (iterator.name === call.name)).group;
            }));
            this.setState({ sessionCalls: sessionCalls, activeSession: name });
        });
    }

    async loadSessionNames() {
        db.fetchUnfinishedSessionNames().then((sessionNames) => { this.setState({ sessionNames }) });
    }

    finishSession(e) {
        e.preventDefault();
        const sessionUpdate = this.state.sessionCalls.map((call) => ({ name: call.name, used: call.disabled, timestamp: call.timestamp}));
        db.setSession(this.state.activeSession, sessionUpdate).then(() => this.loadSessionNames());
        const historyUpdate = this.state.sessionCalls.map((call) => ({ name: call.name, everUsed: call.disabled, uses: [call.timestamp] }));
        db.updateHistory(this.state.activeSession, historyUpdate);
        this.setState({ activeSession: "", sessionCalls: [] });
        this.showAlert("alert-success", "Session saved");
    }

    toggleCall(name) {
        var sessionCalls = this.state.sessionCalls;
        const index = sessionCalls.findIndex((call) => call.name === name);
        if (index >= 0) {
            const call = sessionCalls[index];
            call.disabled = !call.disabled;
            call.timestamp = Date.now();
            sessionCalls[index] = call;
            this.setState({ sessionCalls });
        }
    }

    showAlert(type, text) {
        const alerts = [{ type: type, text: text }];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
    }

    selectActiveSession = (name) => {
        this.loadSession(name);
    }

    selectSortMethod = (sort) => {
        console.log(`Selected Sort: ${sort}`)
    }

    selectActiveGroup = (group) => {
        console.log(`Selected Group: ${group}`)
    }

    render() {
        return (
            <div>
                <RunFunctionBar
                    sessionNames={this.state.sessionNames}
                    activeSession={this.state.activeSession}
                    sortBy={this.state.sortBy}
                    activeGroup={this.state.activeGroup}
                    selectActiveSession={(session) => this.selectActiveSession(session)}
                    selectSortMethod={(sort) => this.selectSortMethod(sort)}
                    selectActiveGroup={(group) => this.selectActiveGroup(group)}
                    finishSession={(e) => this.finishSession(e)}
                />
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <div className="row">
                    <List size="col-md-12" id="runList" columns={4} calls={this.state.sessionCalls} sort={this.state.sort} onClick={(name) => this.toggleCall(name)} />
                </div>
            </div>
        )
    }

}

export default RunSessionView;
