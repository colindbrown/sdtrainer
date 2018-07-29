import React from 'react';
import ClubCard from "./ClubCard";
import * as db from "../util/dbfunctions";
import AddClubCard from './AddClubCard';
import Alerts from "./Alerts";
import ConfirmModal from "./ConfirmModal";
import Loader from "./Loader";
import Placeholder from './Placeholder';
import { NavLink } from "react-router-dom";


class UserDashboard extends React.Component {

    state = {
        clubs: [],
        clubsLoading: true,
        alerts: [],
        templates: [],
        templatesLoading: true
    }

    componentDidMount() {
        this.loadClubs();
        this.loadTemplates();
    }

    loadClubs = async () => {
        const clubs = await db.fetchClubData();
        this.setState({ clubs, clubsLoading: false });
    }

    loadTemplates = async () => {
        const templates = await db.fetchTemplates();
        this.setState({ templates, templatesLoading: false });
    }

    deleteTemplate = async (name) => {
        this.setState({ templatesLoading: true });
        db.deleteTemplate(name).then(() => {
            this.loadTemplates().then(() => {
                this.showAlert("alert-success", "Template deleted");
            })
        });
    }

    deleteClub = async (name) => {
        db.deleteClub(name).then(() => {
            this.loadClubs().then(() => {
                this.showAlert("alert-success", "Club deleted");
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

    deleteItem = (type, name) => {
        switch (type){
            case "club":
                this.setState({modalFunction: () => this.deleteClub(name)});
                break;
            case "template":
                this.setState({modalFunction: () => this.deleteTemplate(name)});
                break;
        }
    }

    render() {
        const firstName = this.props.activeUser.displayName.split(" ")[0];
        var clubCards;
        if (this.state.clubsLoading) {
            clubCards = <Loader/>;
        } else {
            clubCards = this.state.clubs.map((clubData) => <ClubCard 
                key={clubData.name} 
                {...clubData} 
                activeClub={this.props.activeClub} 
                updateActiveClub={(name) => this.props.updateActiveClub(name)} 
                deleteClub={(name) => this.deleteItem("club", name)}
            />);
            clubCards.push(<AddClubCard 
                key="addClubCard" 
                updateActiveClub={(name) => this.props.updateActiveClub(name)}
                showAlert={(type,text) => this.showAlert(type, text)} 
                clearAlerts={() => this.clearAlerts()}
            />);
        }
        var templateListItems;
        if (this.state.templatesLoading) {
            templateListItems = <Loader/>;
        } else {
            templateListItems = this.state.templates.length ? this.state.templates.map((template) => 
            <li className="list-group-item d-flex justify-content-end" key={template.name}>
                <div className="list-item-name"><p><strong>{template.name}</strong></p></div>
                <div className="mr-5">Created on {(new Date(template.createdAt)).toDateString()}</div>
                <button className="btn btn-sm btn-danger" data-toggle="modal" data-target="#confirmModal" onClick={() => this.deleteItem("template", template.name)}>Delete</button>
            </li>
        ) : <li><Placeholder content={{title: "Templates", text: "You don't have any templates to display at the moment.", rel: "/create", destination: "Create a Template"}}/></li>;
        }
        return (
            <div className="container below-navbar">
                <section className="jumbotron text-center club-jumbotron">
                    <div className="container">
                        <h1 className="jumbotron-heading">Welcome {firstName}</h1>
                        <p className="lead text-muted">Choose a club to manage from the clubs below or create a new one</p>
                        <hr/>
                        <p className="lead text-muted"> Or create a template to use in your clubs</p>
                        <NavLink className={`btn btn-info`} to={`/create`}>Create a Template</NavLink>
                    </div>
                </section>
                <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                <ConfirmModal onClick={this.state.modalFunction} />
                <section>
                    <ul className="nav nav-tabs nav-fill row tabs-row" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="text-secondary nav-link active" id="clubs-tab" data-toggle="tab" href="#clubs" role="tab" aria-controls="clubs" aria-selected="true">Clubs</a>
                        </li>
                        <li className="nav-item">
                            <a className="text-secondary nav-link" id="templates-tab" data-toggle="tab" href="#templates" role="tab" aria-controls="templates" aria-selected="false">Templates</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active album card-container" id="clubs" role="tabpanel" aria-labelledby="clubs-tab">
                            <div className="container">
                                <div className="row">
                                    {clubCards}
                                </div>
                            </div>
                        </div>
                        <ul className="tab-pane fade list-group collections-list" id="templates" role="tabpanel" aria-labelledby="templates-tab">
                            {templateListItems}
                        </ul>
                    </div>
                </section>
            </div>
        )
    }
    
}

export default UserDashboard;