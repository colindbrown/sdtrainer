import React from "react";

class ReviewFunctionBar extends React.Component {

    render() {
        const sessionListItems = this.props.sessionNames.map((name) =>
            <button className="dropdown-item" key={name} onClick={() => this.props.selectFilter("session", name)}>{name}</button>
        );
        const groupButtons = [...Array(7).keys()].map((number) =>
            <button className="dropdown-item" key={number} onClick={() => this.props.selectFilter("group", number)}>Group {number}</button>
        );
        const filter = this.props.activeFilter;
        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <div className="dropdown mr-2">
                        <button className={`${filter.type === "filter" ? "active" : ""} btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {filter.type === "filter" ? filter.name : "Filter"}
                        </button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item" key={"used"} onClick={() => this.props.selectFilter("Used", "")}>Used</button>
                            <button className="dropdown-item" key={"unused"} onClick={() => this.props.selectFilter("Unused", "")}>Unused</button>
                            <button className="dropdown-item" key={"new"} onClick={() => this.props.selectFilter("New", "")}>New</button>
                        </div>
                    </div>
                    <div className="dropdown mr-2">
                        <button className={`${filter.type === "session" ? "active" : ""} btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {filter.type === "session" ? filter.name : "Sessions"}
                        </button>
                        <div className="dropdown-menu">
                            {sessionListItems}
                        </div>
                    </div>
                    <div className="dropdown mr-2">
                        <button className={`${filter.type === "group" ? "active" : ""} btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {filter.type === "group" ? filter.name : "Groups"}
                    </button>
                        <div className="dropdown-menu">
                            {groupButtons}
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
                    <button className={`${filter.name ? "" : "disabled"} btn btn-secondary`} href="#" onClick={this.props.resetFilters}>Reset filters</button>
                </div>
                <button className={` btn btn-info`} data-toggle="modal" data-target="#exportModal" onClick={this.props.exportSelection} >Export current selection</button>
            </nav>
        )
    }

}

export default ReviewFunctionBar;