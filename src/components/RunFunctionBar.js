import React from "react";

class RunFunctionBar extends React.Component {

    render() {
        const activeSession = this.props.activeSession || "Select session plan";
        const planListItems = this.props.planNames.map((name) =>
            <button className="dropdown-item" key={name} onClick={() => this.props.selectActiveSession(name)}>{name}</button>
        );
        const disableFunctions = (!this.props.activeSession) ? "disabled" : "";

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <div className="dropdown mr-2">
                        <button className={` btn btn-info dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {activeSession}
                        </button>
                        <div className="dropdown-menu">
                            {planListItems}
                        </div>
                    </div>
                    <div className="dropdown mr-2">
                        <button className={` btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Sort by
                        </button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => this.props.changeSort("userPosition")}>User Order</button>
                            <button className="dropdown-item" onClick={() => this.props.changeSort("")}>Alphabetical</button>
                            <button className="dropdown-item" onClick={() => this.props.changeSort("plus/basic")}>Plus/Basic</button>
                            <button className="dropdown-item" onClick={() => this.props.changeSort("numUses")}>Most Used</button>
                            <button className="dropdown-item" onClick={() => this.props.changeSort("lastUsed")}>Last Used</button>
                            <button className="dropdown-item" onClick={() => this.props.changeSort("group")}>Group</button>
                        </div>
                    </div>
                </div>
                <button className={`${disableFunctions} btn btn-info`} onClick={this.props.finishSession}>Finish running session</button>
            </nav>
        )
    }

}

export default RunFunctionBar;