import React from "react";
import Call from "./Call";
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

const ItemTypes = {
    CALL: 'call'
}

const callSource = {
    beginDrag(props) {
        props.bookmarkCall(props.name);
        return {
            name: props.name,
            position: props.position,
            category: props.category,
            group: props.group,
            callSize: props.callSize
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
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    }
  }

class DragCall extends React.Component {

    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage());
      }

    render() {
        return this.props.connectDragSource(
            <div className={`btn list-group-item call btn-outline-light group-${this.props.group} rounded-call ${this.props.rounded}`} 
                style={{height: `${this.props.callSize.height}px`, width: `${this.props.callSize.width}px`}}
                onClick={this.props.onClick}>
                <Call {...this.props} draggable={true}/>
            </div>
        );
    }

}

export default DragSource(ItemTypes.CALL, callSource, collect)(DragCall);
export {ItemTypes};
