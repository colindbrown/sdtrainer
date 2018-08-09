import React from "react";
import List from "./List";
import { AlertsContext } from "./Alerts";
import { db } from "../util/dbfunctions";
import RunFunctionBar from "./RunFunctionBar";

class RunSessionView extends React.Component {

    state = {
        sessionCalls: [],
        loading: false,
        planNames: [],
        activeSession: "",
        sort: "userPosition"
    }


    componentDidMount() {
        this.loadSessionNames();
        if (this.props.passedCollection) {
            this.loadPassedCollection();
        }
    }

    async loadSession(name) {
        this.setState({loading: true});
        const positions = await db.sessions.fetchPositions(name);
        db.sessions.fetchCalls(name).then((sessionCalls) => {
            sessionCalls.forEach(((call) => {
                call.position = positions.find((iterator) => iterator.name === call.name).position;
                call.disabled = false;
                call.timestamp = Date.now();
            }));
            this.setState({ sessionCalls: sessionCalls, activeSession: name, loading: false });
        });
    }

    async loadSessionNames() {
        this.setState({loading: true});
        db.sessions.fetchPlanNames().then((planNames) => {
            this.setState({ planNames, loading: false });
        });
    }

    async loadPassedCollection() {
        this.loadSession(this.props.passedCollection.name);
        this.props.resetPassedCollection();
    }

    finishSession(e) {
        e.preventDefault();
        const sessionUpdate = this.state.sessionCalls.map((call) => ({ name: call.name, used: call.disabled, timestamp: call.timestamp}));
        db.sessions.finish(this.state.activeSession, sessionUpdate).then(() => this.loadSessionNames());
        const historyUpdate = this.state.sessionCalls.map((call) => ({ name: call.name, everUsed: call.disabled, uses: [call.timestamp] }));
        db.history.update(this.state.activeSession, historyUpdate);
        this.setState({ activeSession: "", sessionCalls: [] });
        this.props.showAlert("alert-success", "Session finished");
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

    selectActiveSession = (name) => {
        this.loadSession(name);
    }

    changeSort(sort) {
        this.setState({sort});
    }


    render() {
        var placeholderContent = {};
        if (this.state.planNames.length > 0) {
            placeholderContent={title: "Run a Session", text: "Select a session plan to run from the function bar above. Once you're done, finish the session using the button on the right."};
        } else {
            placeholderContent={title: "Run a Session", text: "You don't have any session plans to run at the moment.", rel: "/create", destination: "Plan a Session"};
        }
        const listHeader = this.state.activeSession ? "Running session: " + this.state.activeSession : "";
        return (
            <div className="navbar-offset">
                <RunFunctionBar
                    planNames={this.state.planNames}
                    activeSession={this.state.activeSession}
                    selectActiveSession={(session) => this.selectActiveSession(session)}
                    changeSort={(sort) => this.changeSort(sort)}
                    finishSession={(e) => this.finishSession(e)}
                />
                <div className="row no-gutters">
                    <List 
                        callSize="large"
                        id="runList" 
                        header={listHeader}
                        calls={this.state.sessionCalls} 
                        loading={this.state.loading}
                        sort={this.state.sort} 
                        placeholderContent={placeholderContent}
                        onClick={(name) => this.toggleCall(name)} 
                    />
                </div>
            </div>
        )
    }

}

export default props => (
    <AlertsContext.Consumer>
      {functions => <RunSessionView {...props} showAlert={functions.showAlert}/>}
    </AlertsContext.Consumer>
  );