import React from "react";
import Alerts from "./Alerts";
import * as db from "../util/dbfunctions";
import firebase from "firebase";

class FormModal extends React.Component {

    state = {
        email: "",
        password: "",
        alerts: []
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const email = this.state.email;
        const password = this.state.password;

        if (!email || !password) {
            console.log("alerts")
            this.showAlert("alert-warning", "Please enter your email and password");
        } else {
            if (this.props.signInForm) {
                console.log("Sign In");
            } else {
                console.log("create user")
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/weak-password') {
                        this.showAlert("alert-warning", 'The password is too weak');
                    } else if (errorCode === "auth/email-already-in-use") {
                        this.showAlert("alert-warning", "That email is already in use");
                    } else if (errorCode === "auth/invalid-email") {
                        this.showAlert("alert-warning", "That email is invalid");
                    } else {
                        this.showAlert("alert-warning", errorMessage);
                        console.log(error);
                    }
                });
            }
        }
    }

    showAlert(type, text) {
        const alerts = [{ type: type, text: text }];
        this.setState({ alerts });
    }

    clearAlerts = () => {
        this.setState({ alerts: [] });
    }

    render() {
        const signIn = this.props.signInForm;
        return (
            <div className="modal fade" id="formModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="vertical-alignment-helper">
                    <div className="modal-dialog vertical-align-center" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{signIn ? "Sign In" : "Create an account"}</h5>
                                <button type="button close-button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                            <form className="modal-form" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label>Email address</label>
                                    <input type="email" className="form-control" onChange={this.handleEmailChange} placeholder="Enter email" />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control" onChange={this.handlePasswordChange} placeholder="Password" />
                                </div>
                                <button type="submit" className="btn btn-info">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default FormModal;