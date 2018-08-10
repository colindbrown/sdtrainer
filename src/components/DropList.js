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

class DropList extends React.Component {s

    state = {
        removedCall: undefined
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
        this.setState({origin: index});
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
                <List {...this.props} calls={calls} drag={true} size="fill" bookmarkCall={(name) => this.bookmarkCall(name)} replaceCall={() => this.replaceCall()}/>
            </div>
        );
    }

}

export default DropTarget(ItemTypes.CALL, listTarget, collect)(DropList);