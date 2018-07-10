import React from "react";
import FormModal from "./FormModal";

class Home extends React.Component {

    state = {
        modalSignIn: false
    }

    switchModal(bool) {
        this.setState({modalSignIn: bool});
    }

    render() {
        return (
            <div className="container d-flex align-content-center justify-content-center full-page">
                <div className="jumbotron d-flex flex-column align-content-center justify-content-center home-jumbo">
                    <h1 className="cover-heading font-weight-bold">Square</h1>
                    <p className="lead mt-3">A teaching assistant for Square Dancing Callers</p>
                    <p className="lead mt-5">
                    <button data-toggle="modal" data-target="#formModal"className="btn btn-lg btn-info mr-2" onClick={() => this.switchModal(false)}>Create an account</button>
                    <button data-toggle="modal" data-target="#formModal" className="btn btn-lg btn-secondary" onClick={() => this.switchModal(true)}>Sign in</button>
                    </p>
                </div>
                <FormModal signIn={this.state.modalSignIn} />
            </div>
        )
    }
}

export default Home;