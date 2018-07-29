import React from "react";
import Call from "./Call";
import Page from "./Page";
import Placeholder from "./Placeholder";

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
        if (attribute === "name") {
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
        const NUMCOLUMNS = this.props.columns;
        const COLUMNSIZE = 12;
        const sort = this.getSort();

        const id = this.props.id || "listCarousel";

        const filteredCalls = this.filterCalls(this.props.calls);
        const sortedCalls = this.props.sort === "arrayOrder" ? filteredCalls : filteredCalls.sort(sort);

        var listItems = [];
        for (var i = 0; i < sortedCalls.length; i++) {
            const call = sortedCalls[i];
            listItems.push(<Call {...call} key={call.name} rounded={this.roundedCorners(NUMCOLUMNS,COLUMNSIZE,i)} onClick={() => this.handleClick(call.name)} />)
        }
        while (listItems.length % (NUMCOLUMNS*COLUMNSIZE) !== 0 || listItems.length === 0) {
            const roundedCorners = this.roundedCorners(NUMCOLUMNS,COLUMNSIZE,listItems.length);
            listItems.push(<Call empty={true} rounded={roundedCorners} group={0} key={`${id}, ${listItems.length}`} />)
        }

        var pages = [];
        for (var j = 0; j < (listItems.length / (NUMCOLUMNS*COLUMNSIZE)); j++) {
            pages.push(
                <Page 
                    key={j} 
                    active={j === 0 ? "active" : ""} 
                    loading={this.props.loading}
                    columns={NUMCOLUMNS} columnSize={COLUMNSIZE} 
                    calls={listItems.slice(j*(NUMCOLUMNS*COLUMNSIZE), (j+1)*(NUMCOLUMNS*COLUMNSIZE))} 
                />
            );
        }
        const placeholder = !this.props.calls.length && this.props.placeholderContent ? <Placeholder content={this.props.placeholderContent} /> : "";

        return (

            <div id={id} className={`carousel slide ${this.props.size}`} data-wrap="false" data-interval="false">
                <div className="carousel-inner container">
                    {placeholder || ""}
                    {pages}
                </div>
                <a className="carousel-control-prev btn btn-secondary" href={`#${id}`} role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="btn btn-secondary carousel-control-next" href={`#${id}`} role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        )
    }

}

export default List;