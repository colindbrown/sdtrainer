import React from "react";
import List from "./List"
import { ItemTypes } from './DragCall';
import { DropTarget } from 'react-dnd';

function getPlaceholderPosition(callPosition, listPosition, callSize) {
    return {x: Math.floor((callPosition.x - listPosition.x) / callSize.width + 0.5), y: Math.floor((callPosition.y - listPosition.y) / callSize.height + 0.5)}
}

const listTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
    props.moveCallTo(item.name, component.state.placeholderIndex || 0, item.source);
    component.placeholderPosition = undefined;
  },
  hover(props, monitor, component) {
    const activePage = window.$(`#${props.id} > div > .active`)[0];
    const listPosition = { x: activePage.getBoundingClientRect().left, y: activePage.getBoundingClientRect().top}

    const placeholderPosition = getPlaceholderPosition(
      monitor.getSourceClientOffset(),
      listPosition,
      monitor.getItem().callSize
    );

    placeholderPosition["page"] = activePage.id.slice(component.props.id.length);

    if (!component.placeholderPosition || (component.placeholderPosition.x !== placeholderPosition.x || component.placeholderPosition.y !== placeholderPosition.y)) {
        component.placeholderPosition = placeholderPosition;
    }
}
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class DropList extends React.Component {s

    state = {
        placeholderPosition: undefined,
        placeholderIndex: undefined
    }

    set placeholderPosition(placeholderPosition) {
        this.setState({ placeholderPosition });
    }

    get placeholderPosition() {
        return this.state.placeholderPosition;
    }

    setPlaceholderIndex = (placeholderIndex) => {
        if (placeholderIndex !== this.state.placeholderIndex) {
            this.setState({placeholderIndex});
        }
    }

    render() {
        var flexWidth;
        if (this.props.size === "half") {
            flexWidth = "col-md-6";
        } else {
            flexWidth = "col-md-12";
        }
        return this.props.connectDropTarget(
            <div className={`${flexWidth}`}>
                <List
                    {...this.props}
                    drag={true} 
                    placeholderPosition={this.state.placeholderPosition}
                    size="fill"
                    setPlaceholderIndex={this.setPlaceholderIndex}
                />
            </div>
        );
    }

}

export default DropTarget(ItemTypes.CALL, listTarget, collect)(DropList);