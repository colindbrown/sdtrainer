import React from "react";
import List from "./List";
import Alerts from "./Alerts";
import { db } from "../util/dbfunctions";
import CreateFunctionBar from "./CreateFunctionBar";

class CreateCollectionView extends React.Component {

    state = {
        callList: [],
        callsLoading: false,
        collectionList: [],
        collectionCallsLoading: false,
        alerts: [],
        sessionNames: [],
        templateNames: [],
        sort: "",
        filterString: "",
        single: {}
    }

    // Lifecycle methods
    componentDidMount() {
        this.loadAllCalls();
        this.loadTemplateNames();
        if (this.props.activeClub.name) {
            this.loadSessionNames();
        }
    }

    // Async methods
    async loadAllCalls() {
        this.setState({callsLoading: true})
        db.calls.fetchAll().then((allCalls) => {
            db.fetchDisplayData(allCalls).then((displayData) => {
                this.setState({ callList: displayData, callsLoading: false });
            })
        });
    }

    async loadSessionNames() {
        db.sessions.fetchNames().then((sessionNames) => {
            this.setState({ sessionNames });
        });
    }

    async loadTemplateNames() {
        db.templates.fetchNames().then((templateNames) => {
            this.setState({ templateNames });
        });
    }

    async addSession(name) {
        this.setState({ collectionCallsLoading: true })
        db.sessions.fetchCalls(name).then(async (sessionCalls) => {
            const displayData = await db.fetchDisplayData(sessionCalls);
            displayData.forEach(((call) => {
                this.moveCall(call.name, "collectionList");
            }));
            this.setState({collectionCallsLoading: false })
        });
    }

    async addTemplate(name) {
        this.setState({ collectionCallsLoading: true })
        db.templates.fetchCalls(name).then(async (templateCalls) => {
            const displayData = await db.fetchDisplayData(templateCalls);
            displayData.forEach(((call) => {
                this.moveCall(call.name, "collectionList");
            }));
            this.setState({collectionCallsLoading: false })
        });
    }

    async saveNewSession(name) {
        if (!name) {
            this.showAlert("alert-warning", "Please name your session");
        } else if (this.state.collectionList.length === 0) {
            this.showAlert("alert-warning", "Please add some calls to your session");
        } else {
            const sessionExists = await db.sessions.check(name);
            if (sessionExists) {
                this.showAlert("alert-warning", "A session with that name already exists");
            } else {
                const sessionCalls = this.state.collectionList.map((call) => ({ name: call.name, used: false, timestamp: Date.now() }));
                await db.sessions.setSession(name, sessionCalls);
                this.showAlert("alert-success", "Session saved");
                this.removeAll();
                this.loadSessionNames();
                return true;
            }
        }
        return false;
    }

    async saveNewTemplate(name) {
        if (!name) {
            this.showAlert("alert-warning", "Please name your template");
        } else if (this.state.collectionList.length === 0) {
            this.showAlert("alert-warning", "Please add some calls to your template");
        } else {
            const templateExists = await db.templates.check(name);
            if (templateExists) {
                this.showAlert("alert-warning", "A template with that name already exists");
            } else {
                const templateCalls = this.state.collectionList.map((call) => ({ name: call.name }));
                await db.templates.create(name, templateCalls);
                this.showAlert("alert-success", "Template saved");
                this.removeAll();
                this.loadTemplateNames();
                return true;
            }
        }
        return false;
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
        this.setState({ callList, collectionList });
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
        this.setState({collectionCallsLoading: true })
        db.history.fetchByEverUsed(true).then(async (calls) => {
            const displayData = await db.fetchDisplayData(calls);
            displayData.forEach(((call) => {
                this.moveCall(call.name, "collectionList");
            }));
            this.setState({collectionCallsLoading: false })
        })
    }

    removeAll = () => {
        const collectionList = this.state.collectionList.slice(0);
        collectionList.forEach((call) => this.moveCall(call.name, "callList"));
    }

    changeSort(sort) {
        this.setState({sort});
    }

    updateFilterString(string) {
        this.setState({filterString: string});
    }

    filterEnter() {
        if (this.state.single.name) {
            this.moveCall(this.state.single.name, "collectionList");
            return true;
        }  
        return false;
    }

    returnSingle(call) {
        if (this.state.single !== call) {
            this.setState({single: call});
        }
    }

    render() {
        return (
            <div>
                <CreateFunctionBar
                    activeClub={this.props.activeClub.name}
                    addAllUsed={(e) => this.addAllUsed(e)}
                    removeAll={(e) => this.removeAll(e)}
                    saveNewSession={(name) => this.saveNewSession(name)}
                    saveNewTemplate={(name) => this.saveNewTemplate(name)}
                    addSession={(name) => this.addSession(name)}
                    sessionNames={this.state.sessionNames}
                    addTemplate={(name) => this.addTemplate(name)}
                    templateNames={this.state.templateNames}
                    changeSort={(sort) => this.changeSort(sort)}
                    updateFilterString={(string) => this.updateFilterString(string)}
                    filterEnter={() => this.filterEnter()}
                />
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <div className="row">
                    <List
                        size="col-md-6"
                        id="callList"
                        columns={2}
                        calls={this.state.callList}
                        sort={this.state.sort}
                        loading={this.state.callsLoading}
                        onClick={(name) => this.moveCall(name, "collectionList")} 
                        filter={this.state.filterString}
                        returnSingle={(call) => this.returnSingle(call)}
                    />
                    <List
                        size="col-md-6"
                        id="collectionList"
                        columns={2}
                        calls={this.state.collectionList}
                        sort={"arrayOrder"}
                        loading={this.state.collectionCallsLoading}
                        placeholderContent={{title: "Create a Collection", 
                            text: "Add calls to your collection using the function bar or the list to the left. Once you're done, save your collection as either a session plan or a template."}}
                        onClick={(name) => this.moveCall(name, "callList")} 
                    />
                </div>
            </div>
        )
    }

}

export default CreateCollectionView;
