import React from 'react';
import ClassCard from "./ClassCard";
import * as db from "../util/dbfunctions";
import AddClassCard from './AddClassCard';
import Alerts from "./Alerts";
import { NavLink } from "react-router-dom";


class ClassDashboard extends React.Component {

    state = {
        classes: [],
        alerts: []
    }

    componentDidMount() {
        this.loadClasses();
    }

    loadClasses = async () => {
        const classes = await db.fetchClassData();
        this.setState({classes});
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
                <h1> Dashboard </h1>
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
        return (
            <div className="container below-navbar">
                <section className="jumbotron text-center class-jumbotron">
                    {jumboContent}
                </section>
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <div className="album bg-light card-container">
                    <div className="container">
                        <div className="row">
                            {classCards}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default ClassDashboard;