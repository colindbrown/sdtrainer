import React from "react";
import Call from "./Call";

class List extends React.Component {

    render() {
        const listItems = this.props.calls.map(call => <Call {...call} key={call.name} onClick={() => this.props.onClick(call.name)} />);
        while (listItems.length % 11 !== 0) {
            listItems.push(<Call disabled={true} name="~" group={0} key={listItems.length % 11} onClick={() => console.log("pushed")} />)
        }
        const id = this.props.id || "listCarousel";
        return (

            <div id={id} className={`carousel slide ${this.props.size}`} data-wrap="false" data-interval="false">
                <div className="col-md-1"></div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                    <ul className={`list-group`}>
                        {listItems}
                    </ul>
                    </div>
                    <div className="carousel-item">
                    <ul className={`list-group`}>
                        {listItems}
                    </ul>
                    </div>
                    <div className="carousel-item">
                    <ul className={`list-group`}>
                        {listItems}
                    </ul>
                    </div>
                </div>
                <a className="carousel-control-prev btn" href={`#${id}`} role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="btn carousel-control-next" href={`#${id}`} role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        )
    }

}

export default List;