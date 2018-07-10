import React from "react";

class FormModal extends React.Component {

    render() {
        const signIn = this.props.signIn;
        return (
            <div className="modal fade" id="formModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="vertical-alignment-helper">
                    <div className="modal-dialog vertical-align-center" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-center">
                                <h5 className="modal-title">{signIn ? "Sign In" : "Create an account"}</h5>
                                <button type="button close-button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form className="modal-form">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Email address</label>
                                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Password</label>
                                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                                </div>
                                <button type="submit" class="btn btn-info">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default FormModal;