import React from "react";
import Dropdown from "./Dropdown";

class CreateFunctionBar extends React.Component {

    state = {
        newCollectionName: "",
        filterString: ""
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initialCollectionName || nextProps.initialCollectionName === "") {
            this.setState({ newCollectionName: nextProps.initialCollectionName });
        }
    }

    handleChange = (e) => {
        this.setState({ newCollectionName: e.target.value });
    }

    handleSubmit = async (e, type) => {
        e.preventDefault();
        if (type === "session") {
            const success = await this.props.saveNewSession(this.state.newCollectionName);
            if (success) {
                this.setState({ newCollectionName: "" });
            };
        } else {
            const success = await this.props.saveNewTemplate(this.state.newCollectionName);
            if (success) {
                this.setState({ newCollectionName: "" });
            };
        }
        
    }

    handleReset = (e) => {
        e.preventDefault();
        this.props.removeAll();
        this.props.updateFilterString("");
    }

    handleFilterChange = (e) => {
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
        const sessionDropdownItems = this.props.sessionNames.map((name) => ({ text: name, onClick: () => this.props.addSession(name) }));
        const templateDropdownItems = this.props.templateNames.map((name) => ({ text: name, onClick: () => this.props.addTemplate(name) }));

        const sortOptions = [
            { text: "Alphabetical", onClick: () => this.props.changeSort("") },
            { text: "Plus/Basic", onClick: () => this.props.changeSort("plus/basic") },
            { text: "Most Used", onClick: () => this.props.changeSort("numUses") },
            { text: "Last Used", onClick: () => this.props.changeSort("lastUsed") },
            { text: "Group", onClick: () => this.props.changeSort("group") }
        ];

        const saveAsDropdownItems = [
            {text: "Session Plan", onClick: (e) => this.handleSubmit(e, "session"), disabled: !this.props.activeClub},
            {text: "Template", onClick: (e) => this.handleSubmit(e, "template")}
        ]

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <div className="input-group mr-2">
                        <input className="form-control" id="filterBar" type="search" placeholder="Filter Calls" onKeyDown={this.handleEnter} onChange={this.handleFilterChange} ></input>
                        <button className="input-group-addon btn" onClick={this.handleFilterReset}>x</button>
                    </div>
                    <button className={`btn btn-secondary mr-2`} disabled={!this.props.activeClub} onClick={this.props.addAllUsed}>Add all used calls</button>
                    <Dropdown label="Add template" items={templateDropdownItems} type="secondary"/>
                    <Dropdown label="Add session" items={sessionDropdownItems} type="secondary"/>
                    <Dropdown label="Sort by" items={sortOptions} type="secondary"/>
                    <button className="btn btn-secondary" href="#" onClick={this.handleReset}>Reset</button>
                </div>
                <form className="form-inline">
                    <input className="form-control mr-sm-2 save-as-name" type="text" placeholder="Session/Template Name" value={this.state.newCollectionName} onChange={this.handleChange} />
                    <Dropdown label="Save as" items={saveAsDropdownItems} type="info" />
                </form>

            </nav>
        )
    }

}

export default CreateFunctionBar;