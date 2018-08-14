import React from "react";
import List from "./List"
import { ItemTypes } from './DragCall';
import { DropTarget } from 'react-dnd';

function getPlaceholderPosition(callPosition, listPosition, callSize) {
    // shift placeholder if y position more than card height / 2
    return {x: Math.floor((callPosition.x - listPosition.x) / callSize.width + 0.5), y: Math.floor((callPosition.y - listPosition.y) / callSize.height + 0.5)}
  }

const listTarget = {
  drop(props, monitor) {
    props.addCallAt(monitor.getItem().name, 0);
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
        removedCall: undefined,
        placeholderPosition: undefined
    }

    set placeholderPosition(placeholderPosition) {
        this.setState({ placeholderPosition });
    }

    get placeholderPosition() {
        return this.state.placeholderPosition;
    }
    
    replaceCall = () => {
        this.setState({removedCall: undefined});
    }

    hideRemovedCall(calls) {
        if (this.state.removedCall) {
            const index = calls.findIndex((call) => call.name === this.state.removedCall);
            if (index >= 0) {
                calls[index].empty = true;
                calls.push(calls[index]);
                calls.splice(index, 1);
            }
        }
        return calls;
    }

    bookmarkCall = (name) => {
        const index = this.props.calls.findIndex((call) => call.name === name);
        //this.setState({origin: index});
    }

    render() {
        const calls = this.hideRemovedCall(this.props.calls);
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
                    calls={calls} 
                    drag={true} 
                    placeholderPosition={this.state.placeholderPosition}
                    size="fill" 
                    bookmarkCall={(name) => this.bookmarkCall(name)} 
                    replaceCall={() => this.replaceCall()}
                />
            </div>
        );
    }

}

export default DropTarget(ItemTypes.CALL, listTarget, collect)(DropList);