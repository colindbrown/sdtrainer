import React from "react";

class ConfirmModal extends React.Component {

    getStyling() {
        var message;
        var buttonType;
        var buttonText;
        switch (this.props.type) {
            case "delete":
                message = "Are you sure you would like to delete this?";
                buttonText = "Delete";
                buttonType = "danger";
                break;
            case "edit":
                message = "A collection with that name already exists, are you sure you would like to modify it?";
                buttonText = "Modify";
                buttonType = "info";
                break;
        }
        return {message, buttonType, buttonText};
    }

    render() {
        const {message, buttonType, buttonText} = this.getStyling();
        return (
            <div className="modal fade" id="confirmModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="vertical-alignment-helper">
                    <div className="modal-dialog modal-dialog-centered vertical-align-center" role="document">
                        <div className="modal-content confirm-modal">
                            <div className="modal-body">
                                <h5 className="modal-text">{message}</h5>
                                <div className="row">
                                    <button type="button" className={`btn btn-${buttonType} ml-auto mr-2`} data-dismiss="modal" onClick={this.props.onClick}>{buttonText}</button>
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