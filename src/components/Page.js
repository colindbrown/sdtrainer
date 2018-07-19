import React from "react";

class Page extends React.Component {

    render() {
        return (
            <div className={`carousel-item ${this.props.active}`} >
                <div className="row no-gutters d-flex flex-column page">
                    {this.props.calls}
                </div>
            </div>
        )
    }

}

export default Page;