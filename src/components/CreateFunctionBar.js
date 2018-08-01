import React from "react";

class CreateFunctionBar extends React.Component {

    state = {
        newCollectionName: "",
        filterString: ""
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

    handleReset = (e) => {
        e.preventDefault();
        this.props.removeAll();
        //this.setState({ filterString: "" });
        this.props.updateFilterString("");
    }

    handleFilterChange = (e) => {
        //this.setState({ filterString: e.target.value });
        this.props.updateFilterString(e.target.value);
    }

    handleEnter = (e) => {
        if (e.key === 'Enter') {
          if (this.props.filterEnter()) {
              e.target.value = "";
              this.props.updateFilterString("");
          }
        }
      }

      handleFilterReset = () => {
        window.$("#filterBar").val("");
        this.props.updateFilterString("");
      }

    render() {
        var sessionListItems = [];
        if (this.props.activeClub) {
            sessionListItems = this.props.sessionNames.map((name) =>
                <button className="dropdown-item" key={name} onClick={() => this.props.addSession(name)}>{name}</button>
            );
        }
        const templateListItems = this.props.templateNames.map((name) =>
            <button className="dropdown-item" key={name} onClick={() => this.props.addTemplate(name)}>{name}</button>
        );

        const disableSessionMenu = (this.props.activeClub && (this.props.sessionNames.length > 0)) ? "" : "disabled";
        const disableSaveSession = (this.props.activeClub) ? "" : "disabled";
        const disableTemplateMenu = (this.props.templateNames.length > 0) ? "" : "disabled";

        const usedButton = this.props.activeClub ? 
            <button className={`btn btn-secondary mr-2`} onClick={this.props.addAllUsed}>Add all used calls</button> :
            <button className={`btn btn-secondary disabled mr-2`}>Add all used calls</button>;
            

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <div className="input-group mr-2">
                        <input className="form-control" id="filterBar" type="search" placeholder="Filter Calls" onKeyDown={this.handleEnter} onChange={this.handleFilterChange} ></input>
                        <button class="input-group-addon btn" onClick={this.handleFilterReset}>x</button>
                    </div>
                    {usedButton}
                    <div className="dropdown mr-2">
                        <button className={`${disableTemplateMenu} btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Add template
                        </button>
                        <div className="dropdown-menu">
                            {templateListItems}
                        </div>
                    </div>
                    <div className="dropdown mr-2">
                        <button className={`${disableSessionMenu} btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Add session
                        </button>
                        <div className="dropdown-menu">
                            {sessionListItems}
                        </div>
                    </div>
                    <div className="dropdown mr-2">
                        <button className={` btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Sort by
                        </button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => this.props.changeSort("")}>Alphabetical</button>
                            <button className="dropdown-item" onClick={() => this.props.changeSort("plus/basic")}>Plus/Basic</button>
                            <button className="dropdown-item" onClick={() => this.props.changeSort("numUses")}>Most Used</button>
                            <button className="dropdown-item" onClick={() => this.props.changeSort("lastUsed")}>Last Used</button>
                            <button className="dropdown-item" onClick={() => this.props.changeSort("group")}>Group</button>
                        </div>
                    </div>
                    <button className="btn btn-secondary" href="#" onClick={this.handleReset}>Reset</button>
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