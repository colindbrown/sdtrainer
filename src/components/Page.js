import React from "react";

class Page extends React.Component {

    render() {
        const NUMCOLUMNS = this.props.columns;
        const COLUMNSIZE = this.props.columnSize;
        
        var columns = [];
        for (var j = 0; j < NUMCOLUMNS; j++) {
            columns.push(
                <div className={`col-${12/NUMCOLUMNS}`}>
                    <ul className={`list-group btn-group-vertical`}>
                        {this.props.calls.slice(COLUMNSIZE*j,COLUMNSIZE*(j+1))}
                    </ul>
                </div>
            )
        }
        return (
            <div className={`carousel-item ${this.props.active}`} >
                <div className="row no-gutters">
                    {columns}
                </div>
            </div>
        )
    }

}

export default Page;