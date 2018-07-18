import React from 'react';
import * as db from "../util/dbfunctions";
import Alerts from "./Alerts";
import { NavLink } from "react-router-dom";


class ClassDashboard extends React.Component {

    state = {
        templates: [],

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
        const activeClass = this.props.activeClass;
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

                    <ul class="nav nav-tabs nav-fill row pills-row bg-light" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="plans-tab" data-toggle="tab" href="#plans" role="tab" aria-controls="plans" aria-selected="true">Session Plans</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="completed-tab" data-toggle="tab" href="#completed" role="tab" aria-controls="completed" aria-selected="false">Completed Sessions</a>
                        </li>
                    </ul>

                    <div class="tab-content" id="myTabContent">
                        <ul className="tab-pane fade show active list-group collections-list" id="plans" role="tabpanel" aria-labelledby="plans-tab">
                            <li className="list-group-item">
                                test
                            </li>
                        </ul>
                        <ul className="tab-pane fade list-group collections-list" id="completed" role="tabpanel" aria-labelledby="completed-tab">
                            <li className="list-group-item">
                                test
                            </li>
                        </ul>
                    </div>
                </section>

            </div>
        )
    }
    
}

export default ClassDashboard;