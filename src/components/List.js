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

    render() {
        const NUMCOLUMNS = this.props.columns;
        const COLUMNSIZE = 12;

        const id = this.props.id || "listCarousel";

        var listItems = [];
        for (var i = 0; i < this.props.calls.length; i++) {
            const call = this.props.calls[i];
            listItems.push(<Call {...call} key={call.name} rounded={this.roundedCorners(NUMCOLUMNS,COLUMNSIZE,i)} onClick={() => this.props.onClick(call.name)} />)
        }
        while (listItems.length % (NUMCOLUMNS*COLUMNSIZE) !== 0 || listItems.length === 0) {
            listItems.push(<Call empty={true} rounded={this.roundedCorners(NUMCOLUMNS,COLUMNSIZE,listItems.length)} name="~" group={0} key={`${id}, ${listItems.length}`} />)
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