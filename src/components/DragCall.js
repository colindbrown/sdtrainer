import React from "react";
import Call from "./Call";
import { DragSource } from 'react-dnd';

const ItemTypes = {
    CALL: 'call'
}

const callSource = {
    beginDrag(props) {
        props.bookmarkCall(props.name);
        return {
            name: props.name,
            position: props.position
        };
    },
    endDrag(props, monitor) {
        if (!monitor.didDrop()) {
            props.replaceCall();
        }
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
                <Call {...this.props} empty={this.props.isDragging}/>
            </div>
        );
    }

}

export default DragSource(ItemTypes.CALL, callSource, collect)(DragCall);
export {ItemTypes};
