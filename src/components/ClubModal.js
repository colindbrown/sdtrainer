import React from "react";
import { NavLink } from "react-router-dom";

class ClubModal extends React.Component {

    componentWillUnmount() {
        window.$('#clubModal').modal('hide');
        window.$('body').removeClass('modal-open');
        window.$('.modal-backdrop').remove();
    }

    render() {
        const templateName = this.props.name;
        const clubs = this.props.clubs.map((club) => 
            <NavLink className="btn list-group-item bg-light" to="/create" key={club.name} onClick={() => {
                this.props.setPassedCollection(templateName);
                this.props.updateActiveClub(club.name);
            }}>
            {club.name}
            </NavLink>
        );
        return (
            <div className="modal fade" id="clubModal" role="dialog">
                <div className="vertical-alignment-helper">
                    <div className="modal-dialog modal-dialog-centered vertical-align-center" role="document">
                        <div className="modal-content club-modal">
                            <div className="modal-header d-flex justify-content-center">
                                <h4 className="modal-title">Select where you would like to load <span className="font-italic">{templateName}</span>:</h4>
                            </div>
                            <ul className="modal-body list-group">
                               {clubs}
                            </ul>
                            <div className="modal-footer">
                                <NavLink className="btn btn-info mr-2" to={'/create'} onClick={() => this.props.setPassedCollection(templateName)}>Proceed without a club</NavLink>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default ClubModal;