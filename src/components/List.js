import React from "react";
import Call from "./Call";
import Page from "./Page";

class List extends React.Component {

    state = {
        sort: (a,b) => this.alphabeticalSort(a,b)
    }

    componentDidMount() {
        if (this.props.sort) {
            switch (this.props.sort) {
                case "userOrder":
                    console.log("user order");
                    break;
                case "lastUsed":
                    console.log("last used");
                    break;
                case "numUses":
                    console.log("number of uses");
                    break;
                case "group":
                    console.log("group order");
                    break;
                case "plus/basic":
                    console.log("plus basic split");
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

    render() {
        const NUMCOLUMNS = this.props.columns;
        const COLUMNSIZE = 13;

        const id = this.props.id || "listCarousel";
        const sortedCalls = this.props.calls.sort(this.state.sort);
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