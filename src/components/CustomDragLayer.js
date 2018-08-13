import React from 'react';
import ItemTypes from './DragCall';
import Call from "./Call";
import { DragLayer } from 'react-dnd';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

function collect(monitor) {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    };
}

function getItemStyles(props) {
  const { currentOffset } = props;
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

class CustomDragLayer extends React.Component {
  renderItem(type, item) {
    switch (type) {
    case "call":
        return (
            <Call {...item} snapshot={true}/>
        );
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    );
  }
}

export default DragLayer(collect)(CustomDragLayer);