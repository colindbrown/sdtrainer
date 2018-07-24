import React from "react";

class CreateFunctionBar extends React.Component {

    state = {
        newCollectionName: ""
    }

    handleChange = (e) => {
        this.setState({ newCollectionName: e.target.value });
    }

    handleSubmit = (type) => {
        if (type === "session") {
            const result = this.props.saveNewSession(this.state.newCollectionName);
            if (result) {
                this.setState({ newCollectionName: "" });
            };
        } else {
            const result = this.props.saveNewTemplate(this.state.newCollectionName);
            if (result) {
                this.setState({ newCollectionName: "" });
            };
        }
        
    }

    handleRemove = (e) => {
        e.preventDefault();
        this.props.removeAll();
    }


    render() {
        var sessionListItems = [];
        if (this.props.activeClass) {
            sessionListItems = this.props.sessionNames.map((name) =>
                <button className="dropdown-item" key={name} onClick={() => this.props.addSession(name)}>{name}</button>
            );
        }
        const templateListItems = this.props.templateNames.map((name) =>
            <button className="dropdown-item" key={name} onClick={() => this.props.addTemplate(name)}>{name}</button>
        );

        const disableSessionMenu = (this.props.activeClass && (this.props.sessionNames.length > 0)) ? "" : "disabled";
        const disableSaveSession = (this.props.activeClass) ? "" : "disabled";
        const disableTemplateMenu = (this.props.templateNames.length > 0) ? "" : "disabled";

        const usedButton = this.props.activeClass ? 
            <button className={`btn btn-secondary mr-2`} onClick={this.props.addAllUsed}>Add all used calls</button> :
            <button className={`btn btn-secondary disabled mr-2`}>Add all used calls</button>;
            

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <div className="dropdown mr-2">
                        <button className={`${disableTemplateMenu} btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Add template
                        </button>
                        <div className="dropdown-menu">
                            {templateListItems}
                        </div>
                    </div>
                    {usedButton}
                    <div className="dropdown mr-2">
                        <button className={`${disableSessionMenu} btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Add session
                        </button>
                        <div className="dropdown-menu">
                            {sessionListItems}
                        </div>
                    </div>
                    <button className="btn btn-secondary" href="#" onClick={this.handleRemove}>Remove all</button>
                </div>
                <form className="form-inline">
                    <input className="form-control mr-sm-2" placeholder="Name" value={this.state.newCollectionName} onChange={this.handleChange} />
                    <div className="dropdown mr-2">
                        <button className={`btn btn-info dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Save As 
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <button className={`${disableSaveSession} dropdown-item`} key={"session"} onClick={() => this.handleSubmit("session")}>Session Plan</button>
                            <button className="dropdown-item" key={"template"} onClick={() => this.handleSubmit("template")}>Template</button>
                        </div>
                    </div>
                </form>

            </nav>
        )
    }

}

export default CreateFunctionBar;