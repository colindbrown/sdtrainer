import React from 'react';
import { db } from "../util/dbfunctions";
import { AlertsContext } from "./Alerts";
import Loader from "./Loader";
import { NavLink } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import Placeholder from './Placeholder';


class ClubDashboard extends React.Component {

    state = {
        finishedSessions: [],
        loadingFinishedSessions: true,
        sessionPlans: [],
        loadingSessionPlans: true
    }

    componentDidMount() {
        this.loadSessions();
    }

    loadSessions = async () => {
        const finished = await db.sessions.fetchFinished();
        const plans = await db.sessions.fetchPlans();
        this.setState({finishedSessions: finished, sessionPlans: plans, loadingFinishedSessions: false, loadingSessionPlans: false});
    }

    deleteSession = async (name) => {
        this.setState({loadingSessionPlans: true});
        db.sessions.delete(name).then(() => {
            this.loadSessions().then(() => {
                this.props.showAlert("alert-success", "Session deleted");
            })
        });
    }

    deleteItem = (name) => {
        this.setState({modalFunction: () => this.deleteSession(name)});
    }

    render() {
        const activeClub = this.props.activeClub;
        var finishedListItems;
        if (this.state.loadingFinishedSessions) {
            finishedListItems = <Loader/>;
        } else {
            finishedListItems = this.state.finishedSessions.length ? this.state.finishedSessions.map((session) => 
            <li className="list-group-item d-flex" key={session.name}>
                <div className="float-left"><strong>{session.name}</strong></div>
                <div className="ml-auto">Finished on {(new Date(session.finishedAt)).toDateString()}</div>
            </li>
        ) : <Placeholder content={{title: "Finished Sessions", text: "You don't have any finished sessions to display yet.", rel: "/run", destination: "Run a Session"}}/>;
        }
        var unfinishedListItems;
        if (this.state.loadingSessionPlans) {
            unfinishedListItems = <Loader/>;
        } else {
            unfinishedListItems = this.state.sessionPlans.length ? this.state.sessionPlans.map((session) => 
            <li className="list-group-item d-flex justify-content-end" key={session.name}>
                <div className="list-item-name"><p><strong>{session.name}</strong></p></div>
                <div className="mr-5">Created on {(new Date(session.createdAt)).toDateString()}</div>
                <button className="btn btn-sm btn-danger" data-toggle="modal" data-target="#confirmModal" onClick={() => this.deleteItem(session.name)}>Delete</button>
            </li>
        ) : <li><Placeholder content={{title: "Session Plans", text: "You don't have any session plans to display at the moment.", rel: "/create", destination: "Plan a Session"}}/></li>;
        }
        const percentTaught = 100*activeClub.taught/db.calls.count;
        return (
            <div className="container navbar-extra-offset">
                <section className="jumbotron text-center club-jumbotron">
                    <div className="container">
                        <h1 className="jumbotron-heading">{activeClub.name}</h1>
                        <hr/>
                        <p className="lead text-muted">{activeClub.taught} calls out of {db.calls.count} taught</p>
                        <div className="progress">
                            <div className="progress-bar bg-info" style={{ width: `${percentTaught}%` }} role="progressbar"></div>
                        </div>
                        <p className="lead text-muted">{activeClub.sessions} sessions run</p>
                        <hr/>
                        <NavLink className={`btn btn-info mr-2`} to={`/create`}>Plan a Session</NavLink>
                        <NavLink className={`btn btn-secondary`} to={`/`} onClick={() => this.props.resetClub()}>Select another Club</NavLink>
                    </div>
                </section>
                <ConfirmModal onClick={this.state.modalFunction} />
                <section>
                    <ul className="nav nav-tabs nav-fill row tabs-row" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="text-secondary nav-link active" id="plans-tab" data-toggle="tab" href="#plans" role="tab" aria-controls="plans" aria-selected="true">Session Plans</a>
                        </li>
                        <li className="nav-item">
                            <a className="text-secondary nav-link" id="finished-tab" data-toggle="tab" href="#finished" role="tab" aria-controls="finished" aria-selected="false">Finished Sessions</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <ul className="tab-pane fade show active list-group collections-list" id="plans" role="tabpanel" aria-labelledby="plans-tab">
                            {unfinishedListItems}
                        </ul>
                        <ul className="tab-pane fade list-group collections-list" id="finished" role="tabpanel" aria-labelledby="finished-tab">
                            {finishedListItems}
                        </ul>
                    </div>
                </section>

            </div>
        )
    }
    
}

export default props => (
    <AlertsContext.Consumer>
      {functions => <ClubDashboard {...props} showAlert={functions.showAlert}/>}
    </AlertsContext.Consumer>
  );