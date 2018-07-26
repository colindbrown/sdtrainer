import React from "react";
import Call from "./Call";
import Page from "./Page";

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
                return (a,b) => this.lastUsedSort(a,b);
            case "numUses":
                return (a,b) => this.mostUsedSort(a,b);
            case "group":
                return (a,b) => this.groupSort(a,b);
            case "plus/basic":
                return (a,b) => this.plusBasicSort(a,b);
            case "userPosition":
                return (a,b) => this.userSort(a,b);
            default:
                return (a,b) => this.alphabeticalSort(a,b);
        }
    }

    alphabeticalSort(a, b) {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    }

    groupSort(a, b) {
        if (a.group < b.group) {
            return 1;
        } else if (a.group > b.group) {
            return -1;
        } else {
            return this.alphabeticalSort(a,b);
        }
    }

    plusBasicSort(a, b) {
        if (a.category === b.category) {
            return this.alphabeticalSort(a,b);
        } else if (a.category === "plus") {
            return -1;
        } else {
            return 1;
        }
    }

    mostUsedSort(a, b) {
        if (a.uses < b.uses) {
            return 1;
        } else if (a.uses > b.uses) {
            return -1;
        } else {
            return this.alphabeticalSort(a,b);
        }
    }

    lastUsedSort(a, b) {
        if (a.lastUsed < b.lastUsed) {
            return 1;
        } else if (a.lastUsed > b.lastUsed) {
            return -1;
        } else {
            return this.alphabeticalSort(a,b);
        }
    }

    userSort(a, b) {
        if (a.position < b.position) {
            return 1;
        } else if (a.position > b.position) {
            return -1;
        } else {
            return 0;
        }
    }

    async handleClick(name) {
        await this.props.onClick(name)

        const id = this.props.id || "listCarousel";
        if (window.$(`div#${id}`).find(`.active.carousel-item`).length === 0) {
            window.$(`div#${id}`).find(`.carousel-item`).last().addClass("active");
        }

    }

    filterCalls(calls) {
        if (this.props.filter) {
            return calls.filter((call) => call.name.toLowerCase().startsWith(this.props.filter.toLowerCase()));
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
        for (var i = 0; i < (listItems.length / (NUMCOLUMNS*COLUMNSIZE)); i++) {
            pages.push(
                <Page 
                    key={i} 
                    active={i === 0 ? "active" : ""} 
                    columns={NUMCOLUMNS} columnSize={COLUMNSIZE} 
                    calls={listItems.slice(i*(NUMCOLUMNS*COLUMNSIZE), (i+1)*(NUMCOLUMNS*COLUMNSIZE))} 
                />
            );
        }

        return (

            <div id={id} className={`carousel slide ${this.props.size}`} data-wrap="false" data-interval="false">
                <div className="carousel-inner container">
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