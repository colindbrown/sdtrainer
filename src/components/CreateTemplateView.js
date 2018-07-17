import React from "react";
import List from "./List";
import Alerts from "./Alerts";
import * as db from "../util/dbfunctions";
import CreateFunctionBar from "./CreateFunctionBar";

class CreateTemplateView extends React.Component {

    state = {
        callList: [],
        templateList: [],
        alerts: [],
        templateNames: []
    }

    // Lifecycle methods
    componentDidMount() {
        this.loadAllCalls();
        this.loadTemplateNames();
    }

    // Async methods
    async loadAllCalls() {
        db.fetchAllCalls().then((allCalls) => {
            allCalls.sort((a, b) => this.compareCalls(a, b));
            this.setState({ callList: allCalls });
        });
    }

    async loadTemplateNames() {
        db.fetchTemplateNames().then((templateNames) => { this.setState({ templateNames }) });
    }

    async addTemplate(name) {
        db.fetchTemplateCalls(name).then(async (templateCalls) => {
            const displayData = await db.displayData(templateCalls);
            displayData.forEach(((call) => {
                this.moveCall(call.name, "templateList");
            }));
        });
    }

    async saveNewTemplate(name) {
        if (!name) {
            this.showAlert("alert-warning", "Please name your template");
        } else if (this.state.templateList.length === 0) {
            this.showAlert("alert-warning", "Please add some calls to your template");
        } else {
            const template = await db.fetchTemplateRef(name);
            if (template) {
                this.showAlert("alert-warning", "A template with that name already exists");
            } else {
                const templateCalls = this.state.templateList.map((call) => ({ name: call.name }));
                await db.setTemplate(name, templateCalls);
                this.showAlert("alert-success", "Template saved");
                this.removeAll();
                this.loadTemplateNames();
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
        var templateList = this.state.templateList;

        if (destination === "templateList") {
            const index = callList.findIndex((call) => call.name === name);
            if (index >= 0) {
                templateList.push(callList[index]);
                callList.splice(index, 1);
            }
        } else {
            const index = templateList.findIndex((call) => call.name === name);
            if (index >= 0) {
                callList.push(templateList[index]);
                templateList.splice(index, 1);
            }
        }
        callList.sort((a, b) => this.compareCalls(a, b));
        templateList.sort((a, b) => this.compareCalls(a, b));
        this.setState({ callList, templateList });
    }

    showAlert(type, text) {
        const alerts = [{ type: type, text: text }];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
    }

    // Props methods

    removeAll = () => {
        const templateList = this.state.templateList.slice(0);
        templateList.forEach((call) => this.moveCall(call.name, "callList"));
    }

    render() {
        return (
            <div>
                <CreateFunctionBar
                    removeAll={(e) => this.removeAll(e)}
                    saveNewTemplate={(name) => this.saveNewTemplate(name)}
                    addTemplate={(name) => this.addTemplate(name)}
                    templateNames={this.state.templateNames}
                />
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <div className="row">
                    <List size="col-md-6" id="callList" columns={2} calls={this.state.callList} onClick={(name) => this.moveCall(name, "templateList")} />
                    <List size="col-md-6" id="templateList" columns={2} calls={this.state.templateList} onClick={(name) => this.moveCall(name, "callList")} />
                </div>
            </div>
        )
    }

}

export default CreateTemplateView;
