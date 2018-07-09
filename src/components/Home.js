import React from 'react';
import ClassCard from "./ClassCard";
import * as db from "../util/dbfunctions";


class Home extends React.Component {

    state = {
        classes: []
    }

    componentDidMount() {
        this.loadClasses();
    }

    loadClasses = async () => {
        const classes = await db.fetchClassData();
        this.setState({classes});
    }

    render() {
        const classCards = this.state.classes.map((classData) => <ClassCard key={classData.name} {...classData} updateActiveClass={(name) => this.props.updateActiveClass(name)} /> );
        return (
            <div className="container below-navbar">
                <section className="jumbotron text-center">
                    <div className="container">
                    <h1 className="jumbotron-heading">Choose a class to manage</h1>
                    <p className="lead text-muted">Select from the classes below or create a new one</p>
                    <p>
                        <a href="#" className="btn btn-info my-2">Create a new class</a>
                    </p>
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