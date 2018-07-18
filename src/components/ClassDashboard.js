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
        return (
            <div className="container below-navbar">
                <section className="jumbotron text-center class-jumbotron">
                    <div className="container">
                        <h1 className="jumbotron-heading">{activeClass.name}</h1>
                        <hr/>
                        <p className="lead text-muted">Completion statistics will go here</p>
                        <p className="lead text-muted">Sessions info/sessions run here</p>
                        <hr/>
                        <NavLink className={`btn btn-info mr-2`} to={`/plan`}>Plan a Session</NavLink>
                        <NavLink className={`btn btn-secondary`} to={`/`} onClick={() => this.props.resetClass()}>Select another Class</NavLink>
                    </div>
                </section>
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <section>
                    <ul className="nav nav-tabs nav-fill row pills-row bg-light">
                        <li className="nav-item">
                            <a className="nav-link text-info">Templates</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-secondary">Session Plans</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-secondary active">Sessions</a>
                        </li>
                    </ul>
                    <ul className="list-group collections-list">
                        <li className="list-group-item">
                            test
                        </li>
                    </ul>
                </section>

            </div>
        )
    }
    
}

export default ClassDashboard;