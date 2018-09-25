import React from "react";
import DropList from "./DropList";
import ConfirmModal from "./ConfirmModal";
import { AlertsContext } from "./Alerts";
import { db } from "../util/dbfunctions";
import CreateFunctionBar from "./CreateFunctionBar";

class CreateCollectionView extends React.Component {

    state = {
        callList: [],
        callsLoading: false,
        collectionList: [],
        collectionCallsLoading: false,
        sessionNames: [],
        templateNames: [],
        sort: "",
        filterString: "",
        single: {}
    }

    // Lifecycle methods
    componentDidMount() {
        this.loadAllCalls().then(() => {
            if (this.props.passedCollection) {
                this.loadPassedCollection();
            }
        });
        this.loadTemplateNames();
        if (this.props.activeClub.name) {
            this.loadSessionNames();
        }
    }

    // Async methods
    async loadAllCalls() {
        this.setState({callsLoading: true})
        db.calls.fetchAll().then((allCalls) => {
            this.setState({ callList: allCalls, callsLoading: false });
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

    async loadPassedCollection() {
        const {type, name} = this.props.passedCollection;
        if (type.substring(0,4) === "edit") {
            this.setState({ initialCollectionName: name });
        }
        if (type.substring(4,) === "Session") {
            this.addSession(name);
        } else {
            this.addTemplate(name);
        }
        this.props.resetPassedCollection();
    }

    async addSession(name) {
        this.setState({ collectionCallsLoading: true })
        db.sessions.fetchCalls(name).then((sessionCalls) => {
            sessionCalls.forEach(((call) => {
                this.moveCallTo(call.name, -1, "callList", "collectionList");
            }));
            this.setState({collectionCallsLoading: false })
        });
    }

    async addTemplate(name) {
        this.setState({ collectionCallsLoading: true })
        db.templates.fetchCalls(name).then((templateCalls) => {
            templateCalls.forEach(((call) => {
                this.moveCallTo(call.name, -1, "callList", "collectionList");
            }));
            this.setState({collectionCallsLoading: false })
        });
    }

    async saveNewSession(name) {
        if (!name) {
            this.props.showAlert("alert-warning", "Please name your session");
        } else if (this.state.collectionList.length === 0) {
            this.props.showAlert("alert-warning", "Please add some calls to your session");
        } else {
            const {sessionExists, finished} = await db.sessions.check(name);
            if (sessionExists) {
                if (finished) {
                    this.props.showAlert("alert-warning", "You can't modify a finished session");
                } else {
                    this.setState({ onConfirm: async () => {
                        const sessionCalls = this.state.collectionList.map((call) => ({ name: call.name, used: false, timestamp: Date.now() }));
                        await db.sessions.edit(name, sessionCalls);
                        this.props.showAlert("alert-success", "Session edited");
                        this.removeAll();
                        this.setState({initialCollectionName: ""});
                        }});
                    window.$('#confirmModal').modal('show');
                    return false;
                }
            } else {
                const sessionCalls = this.state.collectionList.map((call) => ({ name: call.name, used: false, timestamp: Date.now() }));
                await db.sessions.create(name, sessionCalls);
                this.props.showAlert("alert-success", "Session saved");
                this.removeAll();
                this.loadSessionNames();
                return true;
            }
        }
        return false;
    }

    async saveNewTemplate(name) {
        if (!name) {
            this.props.showAlert("alert-warning", "Please name your template");
        } else if (this.state.collectionList.length === 0) {
            this.props.showAlert("alert-warning", "Please add some calls to your template");
        } else {
            const templateExists = await db.templates.check(name);
            if (templateExists) {
                this.setState({ onConfirm: async () => {
                    const templateCalls = this.state.collectionList.map((call) => ({ name: call.name }));
                    await db.templates.edit(name, templateCalls);
                    this.props.showAlert("alert-success", "Template saved");
                    this.removeAll();
                    this.setState({initialCollectionName: ""});
                    }});
                window.$('#confirmModal').modal('show');
                return false;
            } else {
                const templateCalls = this.state.collectionList.map((call) => ({ name: call.name }));
                await db.templates.create(name, templateCalls);
                this.props.showAlert("alert-success", "Template saved");
                this.removeAll();
                this.loadTemplateNames();
                return true;
            }
        }
        return false;
    }

    // Props methods
    addAllUsed = async (e) => {
        e.preventDefault();
        this.setState({collectionCallsLoading: true })
        db.history.fetchByEverUsed(true).then((calls) => {
            calls.forEach(((call) => {
                this.moveCallTo(call.name, -1, "callList", "collectionList");
            }));
            this.setState({collectionCallsLoading: false })
        })
    }

    removeAll = () => {
        const collectionList = this.state.collectionList.slice(0);
        collectionList.forEach((call) => this.moveCallTo(call.name, -1, "collectionList", "callList"));
    }

    changeSort(sort) {
        this.setState({sort});
    }

    updateFilterString(string) {
        this.setState({filterString: string});
    }

    filterEnter() {
        if (this.state.single.name) {
            this.moveCallTo(this.state.single.name, -1, "callList", "collectionList");
            return true;
        }  
        return false;
    }

    returnSingle(call) {
        if (this.state.single !== call) {
            this.setState({single: call});
        }
    }

    moveCallTo(name, destIndex, source, destination) {
        var lists = { 
            callList: this.state.callList, 
            collectionList: this.state.collectionList 
        }

        const sourceIndex = lists[source].findIndex((call) => call.name === name);
        if (sourceIndex >= 0) {
            var destinationIndex = destIndex === -1 ? lists[destination].length - 1 : destIndex;
            if (source === destination && sourceIndex < destIndex) {
                destinationIndex -= 1;
            }

            const call = lists[source].splice(sourceIndex, 1)[0];
            lists[destination].splice(destinationIndex, 0, call);
        }

        this.setState({ callList: lists.callList, collectionList: lists.collectionList });
    }

    render() {
        return (
            <div className="navbar-offset">
                <CreateFunctionBar
                    activeClub={this.props.activeClub.name}
                    initialCollectionName={this.state.initialCollectionName}
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
                <ConfirmModal type="edit" onClick={() => this.state.onConfirm()} />
                <div className="row no-gutters">
                    <DropList
                        size="half"
                        id="callList"
                        header="Available Calls"
                        calls={this.state.callList}
                        sort={this.state.sort}
                        loading={this.state.callsLoading}
                        onClick={(name) => this.moveCallTo(name, -1, "callList", "collectionList")} 
                        moveCallTo={(name, index, source) => this.moveCallTo(name, index, source, "callList")}
                        filter={this.state.filterString}
                        returnSingle={(call) => this.returnSingle(call)}
                    />
                    <DropList
                        size="half"
                        id="collectionList"
                        header="Selected Calls"
                        calls={this.state.collectionList}
                        sort={"arrayOrder"}
                        loading={this.state.collectionCallsLoading}
                        placeholderContent={{title: "Create a Collection", 
                            text: "Add calls to your collection using the function bar, clicking on the list to the left, or by drag-and-drop. Once you're done, save your collection as either a session plan or a template."}}
                        onClick={(name) => this.moveCallTo(name, -1, "collectionList", "callList")} 
                        moveCallTo={(name, index, source) => this.moveCallTo(name, index, source, "collectionList")}
                    />
                </div>
            </div>
        )
    }

}
export default props => (
    <AlertsContext.Consumer>
      {functions => <CreateCollectionView {...props} showAlert={functions.showAlert}/>}
    </AlertsContext.Consumer>
  );
