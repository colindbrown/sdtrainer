import React from "react";
import Call from "./Call";
import Page from "./Page";
import * as db from "../util/dbfunctions";

class List extends React.Component {

    state = {
        sort: (a,b) => this.alphabeticalSort(a,b)
    }

    componentDidMount() {
        if (this.props.sort) {
            switch (this.props.sort) {
                case "lastUsed":
                    this.setState({sort: (a,b) => this.lastUsedSort(a,b)});
                    break;
                case "numUses":
                    this.setState({sort: (a,b) => this.mostUsedSort(a,b)});
                    break;
                case "group":
                    this.setState({sort: (a,b) => this.groupSort(a,b)});
                    break;
                case "plus/basic":
                    this.setState({sort: (a,b) => this.plusBasicSort(a,b)});
                    break;
                default:
                    this.setState({sort: (a,b) => this.alphabeticalSort(a,b)});
                    break;
            }
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

    render() {
        const NUMCOLUMNS = this.props.columns;
        const COLUMNSIZE = 13;

        const id = this.props.id || "listCarousel";
        const sortedCalls = this.props.sort === "userOrder" ? this.props.calls : this.props.calls.sort(this.state.sort);
        const listItems = sortedCalls.map(call => <Call {...call} key={call.name} onClick={() => this.props.onClick(call.name)} />);

        while (listItems.length % (NUMCOLUMNS*COLUMNSIZE) !== 0 || listItems.length === 0) {
            listItems.push(<Call empty={true} name="~" group={0} key={`${id}, ${listItems.length}`} />)
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