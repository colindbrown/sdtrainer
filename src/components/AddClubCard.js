import React from "react";
import * as db from "../util/dbfunctions";
import { Redirect } from "react-router-dom";

class AddClubCard extends React.Component {

    state = {
        newClubName: "",
        redirect: ""
    }

    handleChange = (e) => {
        this.setState({ newClubName: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const name = this.state.newClubName;

        if (!name) {
            this.props.showAlert("alert-warning", "Please name your club");
        } else {
            const clubData = await db.checkClub(name);
            if (clubData) {
                this.props.showAlert("alert-warning", "A class with that name already exists");
            } else {
                db.createNewClub(this.state.newClubName).then(() => {
                    this.props.updateActiveClub(this.state.newClubName);
                    this.setState({ newClubName: "", redirect: "/club"});
                });
            }
        }
    }

    render() {

        return (
            <div className="col-md-4">
            {this.state.redirect ? <Redirect to={this.state.redirect}/> : ""}
              <div className="card club-card box-shadow">
                <h4 className="club-card-title card-title bg-dark text-white">Add a New Club</h4>
                <div className="card-body">
                  <h5 className="card-text">Choose a descriptive name</h5>
                  <div className="row">
                    <form className="form-inline offset-md-3 col-md-6 justify-content-center mt-2" onSubmit={this.handleSubmit}>
                        <input className="form-control mr-2" placeholder="Name" value={this.state.newClubName} onChange={this.handleChange} />
                        <button className="btn btn-info mt-3" type="submit">Create new club</button>
                    </form>
                    </div>
                </div>
              </div>
            </div>
        )
    }

}

export default AddClubCard;