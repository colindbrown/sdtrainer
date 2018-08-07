import React from "react";
import { DragSource } from 'react-dnd';

const ItemTypes = {
    CALL: 'call'
}

const callSource = {
    beginDrag(props) {
      return {
          name: props.name
      };
    }
  };

  function collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }
  }

class Call extends React.Component {

    render() {
        var styling = "";
        var dataTarget = "#exportModal";
        if (this.props.empty) {
            styling = "disabled list-group-item-light call-empty";
            dataTarget = "";
        } else if (this.props.disabled) {
            styling = "list-group-item-dark call-disabled";
        } else {
            styling = `btn-outline-light group-${this.props.group}`;
        }
        const name = this.props.category === "plus" ? this.props.name + " +" : this.props.name;
        return this.props.connectDragSource(
            <li 
            data-toggle="modal" 
            data-target={dataTarget} 
            className={`btn list-group-item call ${styling} d-flex justify-content-center ${this.props.rounded}`} 
            onClick={this.props.onClick}>
                <span className={`${this.props.empty ? "empty" : ""}`}>{name}</span>
            </li>
        );
    }

}

export default DragSource(ItemTypes.CALL, callSource, collect)(Call);
export {ItemTypes};
