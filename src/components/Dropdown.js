import React from "react";

class Dropdown extends React.Component {


    render() {
        const disabled = this.props.items.length === 0;

        const dropdownItems = this.props.items.map((item) => 
            <button className="dropdown-item" disabled={item.disabled} key={item.text} onClick={item.onClick}>{item.text}</button>
        );

        var active, label;
        if (this.props.active) {
            active = "active";
            label = this.props.activeLabel;
        } else {
            active = "";
            label = this.props.label;
        }

        return (
            <div className="dropdown mr-2">
                <button className={` btn btn-${this.props.type} dropdown-toggle ${active}`} disabled={disabled} data-toggle="dropdown">
                    {label}
                </button>
                <div className="dropdown-menu">
                    {dropdownItems}
                </div>
            </div>
        )
    }
}

export default Dropdown;