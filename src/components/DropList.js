import React from "react";
import List from "./List"
import { ItemTypes } from './DragCall';
import { DropTarget } from 'react-dnd';

const listTarget = {
  drop(props, monitor) {
    props.addCallAt(monitor.getItem().name, 0);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class DropList extends React.Component {

    render() {
        return this.props.connectDropTarget(
            <div className={`${this.props.size}`}>
                <List {...this.props} drag={true} size=""/>
            </div>
        );
    }

}

export default DropTarget(ItemTypes.CALL, listTarget, collect)(DropList);