import React from 'react';
import ClassCard from "./ClassCard";
import * as db from "../util/dbfunctions";
import AddClassCard from './AddClassCard';
import Alerts from "./Alerts";


class Home extends React.Component {

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
        const classCards = this.state.classes.map((classData) => <ClassCard key={classData.name} {...classData} updateActiveClass={(name) => this.props.updateActiveClass(name)} /> );
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
                    <h1 className="jumbotron-heading">Choose a class to manage</h1>
                    <p className="lead text-muted">Select from the classes below or create a new one</p>
                    </div>
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

export default Home;