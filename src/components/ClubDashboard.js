import React from 'react';
import * as db from "../util/dbfunctions";
import Alerts from "./Alerts";
import { NavLink } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";


class ClubDashboard extends React.Component {

    state = {
        alerts: [],
        finishedSessions: [],
        sessionPlans: [],
        templates: []
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

    deleteItem = (name) => {
        this.setState({modalFunction: () => this.deleteSession(name)});
    }

    render() {
        const activeClub = this.props.activeClub;
        const finishedListItems = this.state.finishedSessions.map((session) => 
            <li className="list-group-item d-flex" key={session.id}>
                <div className="float-left"><strong>{session.name}</strong></div>
                <div className="ml-auto">Finished on {(new Date(session.finishedAt)).toDateString()}</div>
            </li>
        );
        const unfinishedListItems = this.state.sessionPlans.map((session) => 
            <li className="list-group-item d-flex justify-content-end" key={session.id}>
                <div className="list-item-name"><p><strong>{session.name}</strong></p></div>
                <div className="mr-5">Created on {(new Date(session.createdAt)).toDateString()}</div>
                <button className="btn btn-sm btn-danger" data-toggle="modal" data-target="#confirmModal" onClick={() => this.deleteItem(session.name)}>Delete</button>
            </li>
        );
        const percentTaught = 100*activeClub.taught/db.totalCalls;
        return (
            <div className="container below-navbar">
                <section className="jumbotron text-center club-jumbotron">
                    <div className="container">
                        <h1 className="jumbotron-heading">{activeClub.name}</h1>
                        <hr/>
                        <p className="lead text-muted">{activeClub.taught} calls out of {db.totalCalls} taught</p>
                        <div className="progress">
                            <div className="progress-bar bg-info" style={{ width: `${percentTaught}%` }} role="progressbar"></div>
                        </div>
                        <p className="lead text-muted">{activeClub.sessions} sessions run</p>
                        <hr/>
                        <NavLink className={`btn btn-info mr-2`} to={`/create`}>Plan a Session</NavLink>
                        <NavLink className={`btn btn-secondary`} to={`/`} onClick={() => this.props.resetClub()}>Select another Club</NavLink>
                    </div>
                </section>
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <ConfirmModal onClick={this.state.modalFunction} />
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

export default ClubDashboard;