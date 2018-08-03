import React from "react";

class Dropdown extends React.Component {


    render() {
        const disabled = this.props.disabled || this.props.items.length === 0 ? "disabled" : "";
        const dropdownItems = this.props.items.map((item) => 
            <button className={`dropdown-item ${item.disabled ? "disabled" : ""}`} disabled={item.disabled} key={item.text} onClick={item.onClick}>{item.text}</button>
        );
        return (
            <div className="dropdown mr-2">
                <button className={` btn btn-${this.props.type} dropdown-toggle ${disabled}`} disabled={disabled} data-toggle="dropdown">
                    {this.props.label}
                </button>
                <div className="dropdown-menu">
                    {dropdownItems}
                </div>
            </div>
        )
    }
}

export default Dropdown;