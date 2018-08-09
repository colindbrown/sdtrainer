import React from "react";
import ReviewFunctionBar from "./ReviewFunctionBar";
import { db } from "../util/dbfunctions";
import List from "./List";
import Modal from "./Modal";

class ReviewClubView extends React.Component {

    state = {
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
        db.calls.fetchAll().then((allCalls) => {
            this.setState({ selectedCalls: allCalls, activeFilter: {}, selectedCallsLoading: false });
        });
    }

    async loadSessionNames() {
        db.sessions.fetchNames().then((sessionNames) => {
            this.setState({ sessionNames });
        });
    }

    async loadSession(name) {
        this.setState({ selectedCallsLoading: true });
        db.sessions.fetchCalls(name).then((sessionCalls) => {
            this.setState({ selectedCalls: sessionCalls, activeFilter: {type: "session", name: name}, selectedCallsLoading: false });
        });
    }

    async showCall(name) {
        this.setState({ modalData: { loading: true }});
        db.history.fetchCall(name).then(async (call) => {
            const sessionData = await db.sessions.fetchAll();
            var body = "";
            if (call.uses.length > 0) {
                body = "Uses:"
                call.uses.forEach((name) => {
                    const session = sessionData.find((sessionIterator) => (sessionIterator.name === name));
                    const date = new Date(session.finishedAt);
                    body = body + `\n${session.name}: ${date.toDateString()}`;
                })
            } else {
                body = "This call has never been used";
            }
            this.setState({modalData: {title: call.name, body: body}})
        })
    }

    resetFilters() {
        this.setState({ activeFilter: {}, sort: ""});
        this.loadAllCalls();
    }

    selectFilter = async (type, name) => {
        switch (type) {
        case 'Used':
                this.setState({ selectedCallsLoading: true });
            db.history.fetchByEverUsed(true).then((calls) => {
                this.setState({ selectedCalls: calls, selectedCallsLoading: false, activeFilter: {type: "filter", name: type} });
            })
            break;
        case 'Unused':
                this.setState({ selectedCallsLoading: true });
            db.history.fetchByEverUsed(false).then((calls) => {
                this.setState({ selectedCalls: calls, selectedCallsLoading: false, activeFilter: {type: "filter", name: type} });
            })
            break;
        case "New":
            this.setState({ selectedCallsLoading: true });
            db.history.fetchNew().then((calls) => {
                this.setState({ selectedCalls: calls, selectedCallsLoading: false, activeFilter: {type: "filter", name: type} });
            })
            break;
        case "Basic":
            this.setState({ selectedCallsLoading: true });
            db.calls.fetchByCategory("basic").then((calls) => {
                this.setState({ selectedCalls: calls, selectedCallsLoading: false, activeFilter: {type: "filter", name: type} });
            })
            break;
        case "Plus":
            this.setState({ selectedCallsLoading: true });
            db.calls.fetchByCategory("plus").then((calls) => {
                this.setState({ selectedCalls: calls, selectedCallsLoading: false, activeFilter: {type: "filter", name: type} });
            })
            break;
        case "session":
            this.loadSession(name);
            break;
        case "group":
            this.setState({ selectedCallsLoading: true });
            db.calls.fetchByGroup(name).then((calls) => {
                this.setState({ selectedCalls: calls, selectedCallsLoading: false, activeFilter: {type: "group", name: "group " + name} });
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
    
    getHeader() {
        const {type, name} = this.state.activeFilter;
        var header;
        switch (type) {
            case "filter":
                header = "Viewing " + name + " calls";
                break;
            case "session":
                header = "Viewing session " + name;
                break;
            case "group":
                header = "Viewing " + name;
                break;
            default:
                header = "Viewing all calls";
                break;
        }
        switch (this.state.sort) {
            case "lastUsed":
                header += ", sorted by Last Used";
                break;
            case "numUses":
                header += ", sorted by Most Used";
                break;
            case "group":
                header += ", sorted by Group";
                break;
            case "plus/basic":
                header += ", sorted by Plus/Basic";
                break;
            default:
                break;
        }
        return header;
    }

    render() {
        const listHeader = this.getHeader();
        return (
            <div className="navbar-offset">
                <Modal data={this.state.modalData}/>
                <ReviewFunctionBar
                    activeFilter={this.state.activeFilter}
                    sessionNames={this.state.sessionNames}
                    selectFilter={(type, name) => this.selectFilter(type, name)}
                    exportSelection={() => {this.exportSelection()}}
                    resetFilters={() => this.resetFilters()}
                    changeSort={(sort) => this.changeSort(sort)}
                />
                <div className="row no-gutters">
                    <List
                        id="reviewList" 
                        header={listHeader}
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