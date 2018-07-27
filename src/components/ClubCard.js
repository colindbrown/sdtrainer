import React from "react";
import { NavLink } from "react-router-dom";

class ClubCard extends React.Component {

    render() {
        const date = new Date(this.props.createdAt);
        const created = `Created on ${date.toDateString()}`;
        return (
            <div className="col-md-4">
              <div className="card club-card box-shadow">
                <h4 className="club-card-title card-title bg-secondary text-white">{this.props.name}</h4>
                <div className="card-body d-flex flex-column align-content-end">
                    <h5>Last active</h5>
                    <p className="card-text">{created}</p>
                    <div className="club-card-button">
                        <NavLink className={`btn btn-info`} to={`/club`} onClick={() => this.props.updateActiveClub(this.props.name)}>Select Club</NavLink>
                    </div>
                </div>
              </div>
            </div>
        )
    }

}

export default ClubCard;