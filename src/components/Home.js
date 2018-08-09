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
            <div className="container d-flex align-content-center justify-content-center full-page bg-dance">
                <div className="d-flex flex-column align-content-center justify-content-center home-jumbo">
                    <h1 className="text-white font-weight-bold">Welcome to <span className="text-silver">SD</span><span className="text-info">Trainer</span></h1>
                    <h3 className="mt-1 text-white">A teaching assistant for Square Dancing callers</h3>
                    <h5 className="mt-3 text-white">
                        Track multiple clubs through learning basic and plus calls,<br/>
                        with tools both for running individual sessions as well as <br/>
                        managing a curriculum over time
                    </h5>
                    <p className="lead mt-4">
                    <button data-toggle="modal" data-target="#formModal"className="btn btn-lg btn-info mr-2" onClick={() => this.switchModal(false)}>Create an account</button>
                    <button data-toggle="modal" data-target="#formModal" className="btn btn-lg btn-secondary" onClick={() => this.switchModal(true)}>Sign in</button>
                    </p>
                </div>
                <FormModal 
                    signInForm={this.state.modalSignIn}
                />
                <footer className="home-footer">
                <p>supported on Chrome and Firefox for laptops and desktops</p>
                </footer>
            </div>
        )
    }
}

export default Home;