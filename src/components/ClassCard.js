import React from "react";

class ClassCard extends React.Component {

    render() {
        const activeClass = this.props.activeClass;
        const date = new Date(this.props.createdAt);
        const created = `Created on ${date.toDateString()}`;
        var buttonText = "Select Class";
        var disabled = "";
        if (activeClass.name === this.props.name) {
            buttonText = "Selected";
            disabled = "disabled";
        }
        return (
            <div className="col-md-4">
              <div className="card class-card box-shadow">
                <h4 className="class-card-title card-title bg-secondary text-white">{this.props.name}</h4>
                <div className="card-body d-flex flex-column align-content-end">
                    <h5>Last active</h5>
                    <p className="card-text">{created}</p>
                    <div className="class-card-button float-right mt-auto">
                        <button type="button" className={`btn btn-info ${disabled}`} onClick={() => this.props.updateActiveClass(this.props.name)}>{buttonText}</button>
                    </div>
                </div>
              </div>
            </div>
        )
    }

}

export default ClassCard;