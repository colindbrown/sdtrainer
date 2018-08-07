import React from "react";
import Call from "./Call";
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

class DragCall extends React.Component {

    render() {
        return this.props.connectDragSource(
            <div>
                <Call {...this.props} />
            </div>
        );
    }

}

export default DragSource(ItemTypes.CALL, callSource, collect)(DragCall);
export {ItemTypes};
