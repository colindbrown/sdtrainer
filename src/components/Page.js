import React from "react";
import Loader from "./Loader";

class Page extends React.Component {

    render() {
        return (
            <div className={`carousel-item ${this.props.active}`}>
                {this.props.loading ? <Loader/> : ""}
                <div className={`row no-gutters d-flex flex-column page`} style={{height: `${this.props.columnSize * this.props.callSize.height}px`}}>
                    {this.props.calls}
                </div>
            </div>
        )
    }

}

export default Page;