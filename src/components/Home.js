import React from 'react';
import ClassCard from "./ClassCard";
import * as db from "../util/dbfunctions";
import Alerts from "./Alerts";


class Home extends React.Component {

    state = {
        classes: [],
        newClassName: "",
        alerts: []
    }

    componentDidMount() {
        this.loadClasses();
    }

    loadClasses = async () => {
        const classes = await db.fetchClassData();
        this.setState({classes});
    }

    handleChange = (e) => {
        this.setState({ newClassName: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const name = this.state.newClassName;

        if (!name) {
            this.showAlert("alert-warning", "Please name your class");
        } else {
            const classData = await db.checkClass(name);
            if (classData) {
                this.showAlert("alert-warning", "A class with that name already exists");
            } else {
                db.createNewClass(this.state.newClassName).then(() => {
                    this.props.updateActiveClass(this.state.newClassName);
                    this.setState({ newCollectionName: "" });
                });
            }
        }
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
        return (
            <div className="container below-navbar">
                <section className="jumbotron text-center">
                    <div className="container">
                    <h1 className="jumbotron-heading">Choose a class to manage</h1>
                    <p className="lead text-muted">Select from the classes below or create a new one</p>
                    </div>
                    <hr/>
                    <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                    <div className="row">
                    <form className="form-inline offset-md-3 col-md-6 justify-content-center mt-2" onSubmit={this.handleSubmit}>
                        <input className="form-control mr-2" placeholder="Name" value={this.state.newClassName} onChange={this.handleChange} />
                        <button className="btn btn-info" type="submit">Create new class</button>
                    </form>
                    </div>
                </section>

                <div className="album bg-light">
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