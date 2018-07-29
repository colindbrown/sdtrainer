import React from "react";
import ReviewFunctionBar from "./ReviewFunctionBar";
import * as db from "../util/dbfunctions";
import List from "./List";
import Modal from "./Modal";
import Alerts from "./Alerts";

class ReviewClubView extends React.Component {

    state = {
        alerts: [],
        selectedCalls: [],
        selectedCallsLoading: false,
        sessionNames: [],
        activeFilter: {},
        modalData: {},
        sort: ""
    }

    componentDidMount() {
        this.loadAllCalls();
        this.loadSessionNames();

    }
    
    async loadAllCalls() {
        this.setState({ selectedCallsLoading: true });
        db.fetchAllCalls().then((allCalls) => {
            db.displayData(allCalls).then((displayData) => {
                this.setState({ selectedCalls: displayData, activeFilter: {}, selectedCallsLoading: false });
            })
        });
    }

    async loadSessionNames() {
        db.fetchSessionNames().then((sessionNames) => { this.setState({ sessionNames }) });
    }

    async loadSession(name) {
        this.setState({ selectedCallsLoading: true });
        db.fetchSessionCalls(name).then(async (sessionCalls) => {
            const displayData = await db.displayData(sessionCalls);
            this.setState({ selectedCalls: displayData, activeFilter: {type: "session", name: name} });
            this.setState({ selectedCallsLoading: false });
        });
    }

    async showCall(name) {
        this.setState({ modalData: { loading: true }});
        db.fetchCallHistory(name).then(async (call) => {
            const sessionData = await db.fetchAllSessions();
            var body = "";
            if (call.uses.length > 0) {
                body = "Uses:"
                call.uses.forEach((id) => {
                    const session = sessionData.find((sessionIterator) => (sessionIterator.id === id));
                    const date = new Date(session.finishedAt);
                    body = body + `\n${session.name}: ${date.toDateString()}`;
                })
            } else {
                body = "This call has never been used";
            }
            this.setState({modalData: {title: call.name, body: body}})
        })
    }

    showAlert(type, text) {
        const alerts = [{ type: type, text: text }];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
    }

    resetFilters() {
        this.setState({ activeFilter: {}});
        this.loadAllCalls();
    }

    selectFilter = async (type, name) => {
        switch (type) {
        case 'Used':
                this.setState({ selectedCallsLoading: true });
            db.fetchByEverUsed(true).then(async (calls) => {
                const displayData = await db.displayData(calls);
                this.setState({ selectedCalls: displayData, selectedCallsLoading: false, activeFilter: {type: "filter", name: type} });
            })
            break;
        case 'Unused':
                this.setState({ selectedCallsLoading: true });
            db.fetchByEverUsed(false).then(async (calls) => {
                const displayData = await db.displayData(calls);
                this.setState({ selectedCalls: displayData, selectedCallsLoading: false, activeFilter: {type: "filter", name: type} });
            })
            break;
        case "New":
            this.setState({ selectedCallsLoading: true });
            db.fetchNew().then(async (calls) => {
                const displayData = await db.displayData(calls);
                this.setState({ selectedCalls: displayData, selectedCallsLoading: false, activeFilter: {type: "filter", name: type} });
            })
            break;
        case "Basic":
            this.setState({ selectedCallsLoading: true });
            db.fetchByCategory("basic").then(async (calls) => {
                const displayData = await db.displayData(calls);
                this.setState({ selectedCalls: displayData, selectedCallsLoading: false, activeFilter: {type: "filter", name: type} });
            })
            break;
        case "Plus":
            this.setState({ selectedCallsLoading: true });
            db.fetchByCategory("plus").then(async (calls) => {
                const displayData = await db.displayData(calls);
                this.setState({ selectedCalls: displayData, selectedCallsLoading: false, activeFilter: {type: "filter", name: type} });
            })
            break;
        case "session":
            this.loadSession(name);
            break;
        case "group":
            this.setState({ selectedCallsLoading: true });
            db.fetchByGroup(name).then((displayData) => {
                this.setState({ selectedCalls: displayData, selectedCallsLoading: false, activeFilter: {type: "group", name: "Group " + name} });
            });
            break;
        default:
            console.log(`Selected filter: ${type + name}`);
        }
    }

    exportSelection() {
        this.setState({ modalData: { loading: true }});
        var text = "";
        if (this.state.selectedCalls.length > 0) {
            this.state.selectedCalls.forEach(((call) => {
                text = text + "\n" + call.name;
            }));
        } else {
            text = " Please select some calls";
        }
        this.setState({modalData: {title: "Selected Calls", body: text.slice(1)}});
    }

    changeSort(sort) {
        this.setState({sort});
    }

    render() {
        return (
            <div>
                <Modal data={this.state.modalData}/>
                <ReviewFunctionBar
                    sessionNames={this.state.sessionNames}
                    activeFilter={this.state.activeFilter}
                    selectFilter={(type, name) => this.selectFilter(type, name)}
                    exportSelection={() => {this.exportSelection()}}
                    resetFilters={() => this.resetFilters()}
                    changeSort={(sort) => this.changeSort(sort)}
                />
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <div className="row">
                    <List 
                        size="col-md-12" 
                        id="reviewList" 
                        columns={4} 
                        calls={this.state.selectedCalls} 
                        loading={this.state.selectedCallsLoading}
                        sort={this.state.sort} 
                        onClick={(name) => this.showCall(name)} 
                    />
                </div>
            </div>
        )
    }

}

export default ReviewClubView;
