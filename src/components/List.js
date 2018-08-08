import React from "react";
import Call from "./Call";
import Page from "./Page";
import Placeholder from "./Placeholder";
import { WindowContext } from "../App";

class List extends React.Component {

    roundedCorners(NUMCOLUMNS,COLUMNSIZE,i) {
        if (i % (NUMCOLUMNS*COLUMNSIZE) === COLUMNSIZE - 1) {
            return "round-bl";
        } else if (i % (NUMCOLUMNS*COLUMNSIZE) === (NUMCOLUMNS*COLUMNSIZE) - (COLUMNSIZE)) {
            return "round-tr";
        }
    }

    getSort() {
        switch (this.props.sort) {
            case "lastUsed":
                return (a,b) => this.sortBy(a,b, "lastUsed", "name");
            case "numUses":
                return (a,b) => this.sortBy(a,b, "uses", "name");
            case "group":
                return (a,b) => this.sortBy(a,b, "group", "name");
            case "plus/basic":
                return (a,b) => this.sortBy(a,b, "category", "name");
            case "userPosition":
                return (a,b) => this.sortBy(a,b, "position", "");
            default:
                return (a,b) => this.sortBy(a,b, "name", "");
        }
    }

    sortBy(a,b, attribute, subAttribute) {
        var reverse = false;
        if (attribute === "name" || attribute === "position") {
            reverse = true;
        }

        if (a[attribute] < b[attribute]) {
            return reverse ? -1 : 1;
        } else if (a[attribute] > b[attribute]) {
            return reverse ? 1 : -1;
        } else {
            if (subAttribute) {
                return this.sortBy(a,b, subAttribute, "");
            } else {
                return 0;
            }
        }
    }

    async handleClick(name) {
        await this.props.onClick(name)

        const id = this.props.id || "listCarousel";
        if (window.$(`div#${id}`).find(`.active.carousel-item`).length === 0) {
            window.$(`div#${id}`).find(`.carousel-item`).last().addClub("active");
        }

    }

    filterCalls(calls) {
        if (this.props.filter) {
            const filtered = calls.filter((call) => call.name.toLowerCase().startsWith(this.props.filter.toLowerCase()));
            if (filtered.length === 1) {
                this.props.returnSingle(filtered[0]);
            }
            return filtered;
        } else {
            return calls;
        }
    }

    render() {
        var callSize;
        if (this.props.callSize === "large") {
            callSize = {height: 60, width: 260};
        } else {
            callSize = {height: 50, width: 220};
        }

        const navHeight = 160;
        var availableWidth, flexWidth;
        if (this.props.size === "half") {
            availableWidth = Math.min(this.props.windowWidth/2, 1200);
            flexWidth = "col-md-6";
        } else {
            availableWidth = Math.min(this.props.windowWidth, 1300);
            flexWidth = "col-md-12";
        }

        const NUMCOLUMNS = Math.floor((availableWidth-140)/callSize.width) || 1;
        const COLUMNSIZE = Math.floor((this.props.windowHeight-navHeight)/callSize.height) || 1;
        const sort = this.getSort();

        const id = this.props.id || "listCarousel";

        const filteredCalls = this.filterCalls(this.props.calls);
        const sortedCalls = this.props.sort === "arrayOrder" ? filteredCalls : filteredCalls.sort(sort);

        var listItems = [];
        for (var i = 0; i < sortedCalls.length; i++) {
            const call = sortedCalls[i];
            listItems.push(<Call {...call} key={call.name} 
                callSize={callSize}
                rounded={this.roundedCorners(NUMCOLUMNS,COLUMNSIZE,i)} 
                onClick={() => this.handleClick(call.name)}
            />);
        }
        while (listItems.length % (NUMCOLUMNS*COLUMNSIZE) !== 0 || listItems.length === 0) {
            const roundedCorners = this.roundedCorners(NUMCOLUMNS,COLUMNSIZE,listItems.length);
            listItems.push(<Call empty={true} rounded={roundedCorners} callSize={callSize} group={0} key={`${id}, ${listItems.length}`} />)
        }

        var pages = [];
        for (var j = 0; j < (listItems.length / (NUMCOLUMNS*COLUMNSIZE)); j++) {
            pages.push(
                <Page 
                    key={j} 
                    active={j === 0 ? "active" : ""} 
                    loading={this.props.loading}
                    columns={NUMCOLUMNS} columnSize={COLUMNSIZE}
                    callSize={callSize}
                    calls={listItems.slice(j*(NUMCOLUMNS*COLUMNSIZE), (j+1)*(NUMCOLUMNS*COLUMNSIZE))}
                />
            );
        }
        const placeholder = !this.props.calls.length && this.props.placeholderContent && !this.props.loading? <Placeholder content={this.props.placeholderContent} /> : "";

        return (
            <div className={`${flexWidth}`}>
                <h4 className="list-header text-secondary">{this.props.header}</h4>
                <div id={id} className={`carousel slide d-flex justify-content-center`} data-wrap="false" data-interval="false">
                    <a className="carousel-control-prev btn btn-secondary" href={`#${id}`} role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <div className="carousel-inner container" style={{width: `${NUMCOLUMNS*callSize.width + 2}px`}}>
                        {placeholder || ""}
                        {pages}
                    </div>
                    <a className="btn btn-secondary carousel-control-next" href={`#${id}`} role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        )
    }

}

export default props => (
    <WindowContext.Consumer>
      {window => <List {...props} windowWidth={window.width} windowHeight={window.height} />}
    </WindowContext.Consumer>
  );