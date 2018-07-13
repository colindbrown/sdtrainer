import React from "react";

class PlanFunctionBar extends React.Component {

    state = {
        newSessionName: ""
    }

    handleChange = (e) => {
        this.setState({ newSessionName: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const result = this.props.saveNewSession(this.state.newSessionName);
        if (result) {
            this.setState({ newSessionName: "" });
        };
    }

    handleRemove = (e) => {
        e.preventDefault();
        this.props.removeAll();
    }


    render() {
        const sessionListItems = this.props.sessionNames.map((name) =>
            <button className="dropdown-item" key={name} onClick={() => this.props.addSession(name)}>{name}</button>
        );

        const disableSessionMenu = (this.props.sessionNames.length > 0) ? "" : "disabled";

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <button className="btn btn-secondary mr-2" href="#" onClick={this.props.addAllUsed}>Add all used calls</button>
                    <div className="dropdown mr-2">
                        <button className={`${disableSessionMenu} btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Add previous session
                        </button>
                        <div className="dropdown-menu">
                            {sessionListItems}
                        </div>
                    </div>
                    <button className="btn btn-secondary" href="#" onClick={this.handleRemove}>Remove all</button>
                </div>
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <input className="form-control mr-sm-2" placeholder="Name Session" value={this.state.newSessionName} onChange={this.handleChange} />
                    <button className="btn btn-info my-2 my-sm-0" type="submit">Save Session Plan</button>
                </form>

            </nav>
        )
    }

}

export default PlanFunctionBar;