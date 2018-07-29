import React from "react";

class ConfirmModal extends React.Component {

    render() {
        return (
            <div className="modal fade" id="confirmModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="vertical-alignment-helper">
                    <div className="modal-dialog modal-dialog-centered vertical-align-center" role="document">
                        <div className="modal-content confirm-modal">
                            <div className="modal-body">
                                <h5 className="modal-text">Are you sure you would like to delete this?</h5>
                                <div className="row">
                                    <button type="button" className="btn btn-danger ml-auto mr-2" data-dismiss="modal" onClick={this.props.onClick}>Delete</button>
                                    <button type="button" className="btn btn-secondary mr-auto" data-dismiss="modal">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default ConfirmModal;