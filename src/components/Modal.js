import React from "react";

class Modal extends React.Component {

    render() {
        const {title, body} = {...this.props.data};
        return (
            <div className="modal fade" id="exportModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="vertical-alignment-helper">
                    <div className="modal-dialog modal-dialog-centered vertical-align-center" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">{title}</h5>
                            </div>
                            <pre className="modal-body">
                                {body}
                            </pre>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Modal;