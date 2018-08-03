import React from "react";
import Dropdown from "./Dropdown";

class RunFunctionBar extends React.Component {

    render() {
        const planListItems = this.props.planNames.map((name) => ({ text: name, onClick: () => this.props.selectActiveSession(name) }));

        const sortOptions = [
            { text: "User Order", onClick: () => this.props.changeSort("userPosition") },
            { text: "Alphabetical", onClick: () => this.props.changeSort("") },
            { text: "Plus/Basic", onClick: () => this.props.changeSort("plus/basic") },
            { text: "Most Used", onClick: () => this.props.changeSort("numUses") },
            { text: "Last Used", onClick: () => this.props.changeSort("lastUsed") },
            { text: "Group", onClick: () => this.props.changeSort("group") }
        ];
        
        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <Dropdown label={this.props.activeSession || "Select session plan"} items={planListItems} type="info"/>
                    <Dropdown label="Sort by" items={sortOptions} type="secondary"/>
                </div>
                <button className="btn btn-info" disabled={!this.props.activeSession} onClick={this.props.finishSession}>Finish running session</button>
            </nav>
        )
    }

}

export default RunFunctionBar;