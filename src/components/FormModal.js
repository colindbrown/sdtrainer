import React from "react";
import Alerts from "./Alerts";
import firebase from "firebase";
import { db } from "../util/dbfunctions";

class FormModal extends React.Component {

    state = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        alerts: []
    }

    componentWillUnmount() {
        window.$('#formModal').modal('hide');
        window.$('body').removeClass('modal-open');
        window.$('.modal-backdrop').remove();
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }

    handleFirstNameChange = (e) => {
        this.setState({ firstName: e.target.value });
    }

    handleLastNameChange = (e) => {
        this.setState({ lastName: e.target.value });
    }


    handleSubmit = async (e) => {
        e.preventDefault();
        const email = this.state.email;
        const password = this.state.password;
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;

        if (!email || !password) {
            this.showAlert("alert-warning", "Please enter your email and password");
        } else {
            if (this.props.signInForm) {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .catch((error) => {
                    
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    if (errorCode === 'auth/invalid-email') {
                        this.showAlert("alert-warning", 'That email is invalid');
                    } else if (errorCode === "auth/user-disabled") {
                        this.showAlert("alert-warning", "That email has been disabled");
                    } else if (errorCode === "auth/user-not-found") {
                        this.showAlert("alert-warning", "There is no user associated with that email");
                    } else if (errorCode === "auth/wrong-password") {
                        this.showAlert("alert-warning", "That password was incorrect");
                    } else {
                        this.showAlert("alert-warning", errorMessage);
                        console.log(error);
                    }
                  });
            } else {
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
                }).then((userCred) => {
                    userCred.user.updateProfile({displayName: `${firstName} ${lastName}`});
                    db.users.createUser(userCred.user);
                })
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
        const nameInput = this.props.signInForm ? "" : 
            <div className="row form-group">
                <div className="col">
                    <input type="text" className="form-control" onChange={this.handleFirstNameChange} placeholder="First Name" />
                </div>
                <div className="col">
                    <input type="text" className="form-control" onChange={this.handleLastNameChange} placeholder="Last Name" />
                </div>
            </div>;
        
        const signIn = this.props.signInForm;
        return (
            <div className="modal fade" id="formModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="vertical-alignment-helper">
                    <div className="modal-dialog vertical-align-center" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title form-modal-title">{signIn ? "Sign In" : "Create an account"}</h5>
                                <button type="button close-button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <Alerts alerts={this.state.alerts} clearAlerts={() => this.clearAlerts()} />
                            <form className="modal-form" onSubmit={this.handleSubmit}>
                                {nameInput}
                                <div className="form-group">
                                    <input type="email" className="form-control" onChange={this.handleEmailChange} placeholder="Email Address" />
                                </div>
                                <div className="form-group">
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