import React from "react";

class ClassCard extends React.Component {

    render() {
        return (
            <div className="col-md-4">
              <div className="card class-card box-shadow">
                <h4 className="class-card-title card-title bg-secondary text-white">{this.props.name}</h4>
                <div className="card-body">
                  <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div className="float-right">
                      <button type="button" className="btn btn-info" onClick={() => this.props.updateActiveClass(this.props.name)}>Select Class</button>
                  </div>
                </div>
              </div>
            </div>
        )
    }

}

export default ClassCard;