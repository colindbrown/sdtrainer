import React from 'react';
import ClassCard from "./ClassCard";
import * as db from "../util/dbfunctions";
import AddClassCard from './AddClassCard';
import Alerts from "./Alerts";
import { NavLink } from "react-router-dom";


class UserDashboard extends React.Component {

    state = {
        classes: [],
        alerts: [],
        templates: []
    }

    componentDidMount() {
        this.loadClasses();
        this.loadTemplates();
    }

    loadClasses = async () => {
        const classes = await db.fetchClassData();
        this.setState({classes});
    }

    loadTemplates = async () => {
        const templates = await db.fetchTemplates();
        this.setState({templates});
    }

    deleteTemplate = async (name) => {
        db.deleteTemplate(name).then(() => {
            this.loadTemplates().then(() => {
                this.showAlert("alert-success", "Template deleted");
            })
        });
    }

    showAlert(type, text) {
        const alerts = [{ type: type, text: text }];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
    }

    render() {
        const firstName = this.props.activeUser.displayName.split(" ")[0];
        const activeClass = this.props.activeClass;
        const classCards = this.state.classes.map((classData) => <ClassCard 
            key={classData.name} 
            {...classData} 
            activeClass={activeClass} 
            updateActiveClass={(name) => this.props.updateActiveClass(name)} /> 
        );
        classCards.push(<AddClassCard 
            key="addClassCard" 
            updateActiveClass={(name) => this.props.updateActiveClass(name)}
            showAlert={(type,text) => this.showAlert(type, text)} 
            clearAlerts={() => this.clearAlerts()}
            />)
        var jumboContent;
        if (activeClass.name) {
            jumboContent = <div className="container">
                <h1 className="jumbotron-heading">{activeClass.name}</h1>
                <hr/>
                <p className="lead text-muted">Completion statistics will go here</p>
                <p className="lead text-muted">Sessions info/sessions run here</p>
                <hr/>
                <NavLink className={`btn btn-info mr-2`} to={`/plan`}>Plan a Session</NavLink>
                <NavLink className={`btn btn-info`} to={`/templates`}>Create a Template</NavLink>
            </div>;
        } else {
            jumboContent = <div className="container">
                <h1 className="jumbotron-heading">Welcome {firstName}</h1>
                <p className="lead text-muted">Choose a class to manage from the classes below or create a new one</p>
                <hr/>
                <p className="lead text-muted"> Or create a template to use in your classes</p>
                <NavLink className={`btn btn-info`} to={`/templates`}>Create a Template</NavLink>
            </div>;
        }
        const templateListItems = this.state.templates.map((template) => 
            <li className="list-group-item d-flex justify-content-end" key={template.name}>
                <div className="list-item-name"><p><strong>{template.name}</strong></p></div>
                <div className="mr-5">Created on {(new Date(template.createdAt)).toDateString()}</div>
                <button className="btn btn-sm btn-danger" onClick={() => this.deleteTemplate(template.name)}>Delete</button>
            </li>
        );
        return (
            <div className="container below-navbar">
                <section className="jumbotron text-center class-jumbotron">
                    {jumboContent}
                </section>
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <section>
                    <ul className="nav nav-tabs nav-fill row pills-row bg-light" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="text-secondary nav-link active" id="classes-tab" data-toggle="tab" href="#classes" role="tab" aria-controls="classes" aria-selected="true">Classes</a>
                        </li>
                        <li className="nav-item">
                            <a className="text-secondary nav-link" id="templates-tab" data-toggle="tab" href="#templates" role="tab" aria-controls="templates" aria-selected="false">Templates</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active album bg-light card-container" id="classes" role="tabpanel" aria-labelledby="classes-tab">
                            <div className="container">
                                <div className="row">
                                    {classCards}
                                </div>
                            </div>
                        </div>
                        <ul className="tab-pane fade list-group collections-list bg-light" id="templates" role="tabpanel" aria-labelledby="templates-tab">
                            {templateListItems}
                        </ul>
                    </div>
                </section>
            </div>
        )
    }
    
}

export default UserDashboard;