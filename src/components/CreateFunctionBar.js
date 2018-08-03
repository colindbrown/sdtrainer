import React from "react";
import Dropdown from "./Dropdown";

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

    render() {
        const sessionListItems = this.props.sessionNames.map((name) => ({ text: name, onClick: () => this.props.addSession(name) }));
        const templateListItems = this.props.templateNames.map((name) => ({ text: name, onClick: () => this.props.addTemplate(name) }));

        const sortOptions = [
            { text: "Alphabetical", onClick: () => this.props.changeSort("") },
            { text: "Plus/Basic", onClick: () => this.props.changeSort("plus/basic") },
            { text: "Most Used", onClick: () => this.props.changeSort("numUses") },
            { text: "Last Used", onClick: () => this.props.changeSort("lastUsed") },
            { text: "Group", onClick: () => this.props.changeSort("group") }
        ];

        const saveListItems = [
            {text: "Session Plan", onClick: () => this.handleSubmit("session"), disabled: !this.props.activeClub},
            {text: "Template", onClick: () => this.handleSubmit("template")}
        ]

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <input className="form-control mr-sm-2" placeholder="Filter Calls" onKeyDown={this.handleEnter} onChange={this.handleFilterChange} />
                    <button className={`btn btn-secondary mr-2`} disabled={!this.props.activeClub} onClick={this.props.addAllUsed}>Add all used calls</button>
                    <Dropdown label="Add template" items={templateListItems} type="secondary"/>
                    <Dropdown label="Add session" items={sessionListItems} type="secondary" disabled={!this.props.activeClub}/>
                    <Dropdown label="Sort by" items={sortOptions} type="secondary"/>
                    <button className="btn btn-secondary" href="#" onClick={this.handleReset}>Reset</button>
                </div>
                <form className="form-inline">
                    <input className="form-control mr-sm-2" placeholder="Name" value={this.state.newCollectionName} onChange={this.handleChange} />
                    <Dropdown label="Save as" items={saveListItems} type="info" />
                </form>

            </nav>
        )
    }

}

export default CreateFunctionBar;