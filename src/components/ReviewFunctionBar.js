import React from "react";
import Dropdown from "./Dropdown";

class ReviewFunctionBar extends React.Component {

    render() {
        const filterDropdownItems = [
            { text: "Used", onClick: () => this.props.selectFilter("Used", "") },
            { text: "Unused", onClick: () => this.props.selectFilter("Unused", "") },
            { text: "New", onClick: () => this.props.selectFilter("New", "") },
            { text: "Basic", onClick: () => this.props.selectFilter("Basic", "") },
            { text: "Plus", onClick: () => this.props.selectFilter("Plus", "") }
        ]

        const sessionDropdownItems = this.props.sessionNames.map((name) => ({ text: name, onClick: () => this.props.selectFilter("session", name) }));
        const groupDropdownItems = [...Array(7).keys()].map((number) => ({ text: `Group ${number}`, onClick: () => this.props.selectFilter("group", number) }));

        const sortOptions = [
            { text: "Alphabetical", onClick: () => this.props.changeSort("") },
            { text: "Plus/Basic", onClick: () => this.props.changeSort("plus/basic") },
            { text: "Most Used", onClick: () => this.props.changeSort("numUses") },
            { text: "Last Used", onClick: () => this.props.changeSort("lastUsed") },
            { text: "Group", onClick: () => this.props.changeSort("group") }
        ];

        const filterType = this.props.activeFilter.type;
        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <Dropdown label={"Filter"} items={filterDropdownItems} type="secondary" active={filterType === "filter"} />
                    <Dropdown label={"Sessions"} items={sessionDropdownItems} type="secondary" active={filterType === "session"} />
                    <Dropdown label={"Groups"} items={groupDropdownItems} type="secondary" active={filterType === "group"} />
                    <Dropdown label="Sort by" items={sortOptions} type="secondary"/>
                    <button className="btn btn-secondary" disabled={!filterType} onClick={this.props.resetFilters}>Reset filters</button>
                </div>
                <button className={` btn btn-info`} data-toggle="modal" data-target="#exportModal" onClick={this.props.exportSelection} >Export current selection</button>
            </nav>
        )
    }

}

export default ReviewFunctionBar;