import React from "react";

class Modal extends React.Component {

    formatCalls(calls) {
        var text = "";
        calls.forEach(((call) => {
            text = text + "\n" + call.name;
        }));
        return text.slice(1);
    }

    render() {
        const exportedText = this.formatCalls(this.props.calls);
        return (
            <div className="modal fade" id="exampleModalCenter" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Selected Calls</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <pre className="modal-body">
                        {exportedText}
                    </pre>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Modal;