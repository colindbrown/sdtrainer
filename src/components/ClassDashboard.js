import React from 'react';
import * as db from "../util/dbfunctions";
import Alerts from "./Alerts";
import { NavLink } from "react-router-dom";


class ClassDashboard extends React.Component {

    state = {
        alerts: [],
        finishedSessions: [],
        sessionPlans: []
    }

    componentDidMount() {
        this.loadSessions();
    }

    loadSessions = async () => {
        const finished = await db.fetchfinishedSessions();
        const plans = await db.fetchUnfinishedSessions();
        this.setState({finishedSessions: finished, sessionPlans: plans});
    }

    deleteSession = async (id) => {
        db.deleteSession(id).then(() => {
            this.loadSessions().then(() => {
                this.showAlert("alert-success", "Session deleted");
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
        const activeClass = this.props.activeClass;
        const finishedListItems = this.state.finishedSessions.map((session) => 
            <li className="list-group-item d-flex" key={session.id}>
                <div className="float-left"><strong>{session.name}</strong></div>
                <div className="ml-auto">Finished on {(new Date(session.finishedAt)).toDateString()}</div>
            </li>
        );
        const unfinishedListItems = this.state.sessionPlans.map((session) => 
            <li className="list-group-item d-flex justify-content-end" key={session.id}>
                <div className="session-name"><p><strong>{session.name}</strong></p></div>
                <div className="mr-5">Created on {(new Date(session.createdAt)).toDateString()}</div>
                <button className="btn btn-sm btn-danger" onClick={() => this.deleteSession(session.name)}>Delete</button>
            </li>
        );
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
                    <ul className="nav nav-tabs nav-fill row pills-row bg-light" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="text-secondary nav-link active" id="plans-tab" data-toggle="tab" href="#plans" role="tab" aria-controls="plans" aria-selected="true">Session Plans</a>
                        </li>
                        <li className="nav-item">
                            <a className="text-secondary nav-link" id="finished-tab" data-toggle="tab" href="#finished" role="tab" aria-controls="finished" aria-selected="false">Finished Sessions</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <ul className="tab-pane fade show active list-group collections-list bg-light" id="plans" role="tabpanel" aria-labelledby="plans-tab">
                            {unfinishedListItems}
                        </ul>
                        <ul className="tab-pane fade list-group collections-list bg-light" id="finished" role="tabpanel" aria-labelledby="finished-tab">
                            {finishedListItems}
                        </ul>
                    </div>
                </section>

            </div>
        )
    }
    
}

export default ClassDashboard;