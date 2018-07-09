import React from "react";
import * as db from "../util/dbfunctions";

class AddClassCard extends React.Component {

    state = {
        newClassName: ""
    }

    handleChange = (e) => {
        this.setState({ newClassName: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const name = this.state.newClassName;

        if (!name) {
            this.props.showAlert("alert-warning", "Please name your class");
        } else {
            const classData = await db.checkClass(name);
            if (classData) {
                this.props.showAlert("alert-warning", "A class with that name already exists");
            } else {
                db.createNewClass(this.state.newClassName).then(() => {
                    this.props.updateActiveClass(this.state.newClassName);
                    this.setState({ newClassName: "" });
                });
            }
        }
    }

    render() {

        return (
            <div className="col-md-4">
              <div className="card class-card box-shadow">
                <h4 className="class-card-title card-title bg-dark text-white">Add a New Class</h4>
                <div className="card-body">
                  <h5 className="card-text">Choose a descriptive name</h5>
                  <div className="row">
                    <form className="form-inline offset-md-3 col-md-6 justify-content-center mt-3" onSubmit={this.handleSubmit}>
                        <input className="form-control mr-2" placeholder="Name" value={this.state.newClassName} onChange={this.handleChange} />
                        <button className="btn btn-info mt-2" type="submit">Create new class</button>
                    </form>
                    </div>
                </div>
              </div>
            </div>
        )
    }

}

export default AddClassCard;