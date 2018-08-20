import React from "react";
import Call from "./Call";
import DragCall from "./DragCall";
import Page from "./Page";
import Placeholder from "./Placeholder";
import { WindowContext } from "../App";

class List extends React.Component {

    state = {
        navHeight: 160,
        currentTimeout: undefined
    }

    static getDerivedStateFromProps(props, state) {
        var updatedState = state;

        if (props.callSize === "large") {
            updatedState.callSize = {height: 60, width: 260};
        } else {
            updatedState.callSize = {height: 50, width: 220};
        }

        var availableWidth;
        if (props.size === "half") {
            updatedState.flexWidth = "col-md-6";
            availableWidth = Math.min(props.windowWidth/2, 1300);
        } else if (props.size === "fill") {
            updatedState.flexWidth = "col-md-12";
            availableWidth = Math.min(props.windowWidth/2, 1300);
        } else {
            updatedState.flexWidth = "col-md-12";
            availableWidth = Math.min(props.windowWidth, 1300);
        }

        updatedState.NUMCOLUMNS = Math.floor((availableWidth-140)/updatedState.callSize.width) || 1;
        updatedState.COLUMNSIZE = Math.floor((props.windowHeight-state.navHeight)/updatedState.callSize.height) || 1;

        if (props.draggable) {
            updatedState.placeholderIndex = List.getPlaceholderIndex(props, updatedState.NUMCOLUMNS, updatedState.COLUMNSIZE);
            props.setPlaceholderIndex(updatedState.placeholderIndex);
            updatedState.currentTimeout = List.handlePageTurns(props, state.currentTimeout, updatedState.NUMCOLUMNS, updatedState.COLUMNSIZE);
        }

        return updatedState;
    }

    roundedCorners(NUMCOLUMNS,COLUMNSIZE,i) {
        if (i % (NUMCOLUMNS*COLUMNSIZE) === COLUMNSIZE - 1) {
            return "round-bl";
        } else if (i % (NUMCOLUMNS*COLUMNSIZE) === (NUMCOLUMNS*COLUMNSIZE) - (COLUMNSIZE)) {
            return "round-tr";
        }
    }

    getSort() {
        switch (this.props.sort) {
            case "lastUsed":
                return (a,b) => this.sortBy(a,b, "lastUsed", "name");
            case "numUses":
                return (a,b) => this.sortBy(a,b, "uses", "name");
            case "group":
                return (a,b) => this.sortBy(a,b, "group", "name");
            case "plus/basic":
                return (a,b) => this.sortBy(a,b, "category", "name");
            case "userPosition":
                return (a,b) => this.sortBy(a,b, "position", "");
            default:
                return (a,b) => this.sortBy(a,b, "name", "");
        }
    }

    sortBy(a,b, attribute, subAttribute) {
        var reverse = false;
        if (attribute === "name" || attribute === "position") {
            reverse = true;
        }

        if (a[attribute] < b[attribute]) {
            return reverse ? -1 : 1;
        } else if (a[attribute] > b[attribute]) {
            return reverse ? 1 : -1;
        } else {
            if (subAttribute) {
                return this.sortBy(a,b, subAttribute, "");
            } else {
                return 0;
            }
        }
    }

    async handleClick(name) {
        await this.props.onClick(name)

        const id = this.props.id || "listCarousel";
        if (window.$(`div#${id}`).find(`.active.carousel-item`).length === 0) {
            window.$(`div#${id}`).find(`.carousel-item`).last().addClub("active");
        }

    }

    filterCalls(calls) {
        if (this.props.filter) {
            const filtered = calls.filter((call) => call.name.toLowerCase().startsWith(this.props.filter.toLowerCase()));
            if (filtered.length === 1) {
                this.props.returnSingle(filtered[0]);
            }
            return filtered;
        } else {
            return calls;
        }
    }

    static getPlaceholderIndex(props, NUMCOLUMNS, COLUMNSIZE) {
        if (props.sort === "arrayOrder" && props.placeholderPosition) {
            const {x, y, page} = props.placeholderPosition;
            if (y < 0 || y >= COLUMNSIZE) {
                return undefined;
            } else if (x < 0 || x >= NUMCOLUMNS) {
                return undefined;
            } else {
                const placeholderIndex = (y + COLUMNSIZE * (x + NUMCOLUMNS * (page)));
                if (placeholderIndex < 0) {
                    return undefined;
                } else if (placeholderIndex > props.calls.length) {
                    return props.calls.length;
                } else {
                    if (props.dragSourceOrigin && props.dragSourcePosition < placeholderIndex) {
                        return placeholderIndex + 1;
                    } else {
                        return placeholderIndex;
                    }
                }
            }
        }
        return undefined;
    }

    static handlePageTurns(props, timeout, NUMCOLUMNS, COLUMNSIZE) {
        if (props.sort === "arrayOrder" && props.placeholderPosition) {
            const {x, y} = props.placeholderPosition;
            if (y < 0 || y >= COLUMNSIZE) {
                clearTimeout(timeout);
                return undefined;
            } else if (x < 0) {
                clearTimeout(timeout);
                return setTimeout(() => {
                    window.$(`#${props.id}`).carousel('prev');
                }, 1000);
            } else if (x >= NUMCOLUMNS) {
                clearTimeout(timeout);
                return setTimeout(() => {
                    window.$(`#${props.id}`).carousel('next');
                }, 1000);
            } else {
                clearTimeout(timeout);
                return undefined;
            }
        } else if (timeout) {
            clearTimeout(timeout);
        }
        return undefined;

    }

    render() {
        const {NUMCOLUMNS, COLUMNSIZE, callSize, placeholderIndex, flexWidth} = this.state;

        const sort = this.getSort();
        const id = this.props.id || "listCarousel";
        const placeholder = !this.props.calls.length && this.props.placeholderContent && !this.props.loading? <Placeholder content={this.props.placeholderContent} /> : "";

        const filteredCalls = this.filterCalls(this.props.calls);

        var listCalls;
        if (this.props.sort === "arrayOrder") {
            listCalls = filteredCalls.slice(0);
            if (placeholderIndex >= 0) {
                if (placeholderIndex >= filteredCalls.length) {
                    listCalls.push({empty: true});
                } else {
                    listCalls.splice(placeholderIndex, 0, {empty: true});
                }
            }
        } else {
            listCalls = filteredCalls.sort(sort);
        }     

        const onePage = this.props.calls.length <= NUMCOLUMNS * COLUMNSIZE;
        var listItems = [];
        for (var i = 0; i < listCalls.length; i++) {
            const call = listCalls[i];
            if (call.empty) {
                const roundedCorners = this.roundedCorners(NUMCOLUMNS,COLUMNSIZE,listItems.length);
                listItems.push(<Call empty={true} rounded={roundedCorners} callSize={callSize} group={0} key={`placeholder`} />);
            } else {
                listItems.push(this.props.draggable ? 
                    <DragCall {...call} key={call.name}
                        position={i}
                        rounded={this.roundedCorners(NUMCOLUMNS,COLUMNSIZE,i)} 
                        onClick={() => this.handleClick(call.name)}
                        callSize={callSize}
                        source={this.props.id}
                    />
                    : <Call {...call} key={call.name} callSize={callSize} rounded={this.roundedCorners(NUMCOLUMNS,COLUMNSIZE,i)} onClick={() => this.handleClick(call.name)} />
                )
            }
        }
        while (listItems.length % (NUMCOLUMNS*COLUMNSIZE) !== 0 || listItems.length === 0) {
            const roundedCorners = this.roundedCorners(NUMCOLUMNS,COLUMNSIZE,listItems.length);
            listItems.push(<Call empty={true} rounded={roundedCorners} callSize={callSize} group={0} key={`${id}, ${listItems.length}`} />);
        }

        var pages = [];
        var extraCallAdded = false;
        for (var j = 0; j < (listItems.length / (NUMCOLUMNS*COLUMNSIZE)); j++) {
            var firstCallIndex = j*(NUMCOLUMNS*COLUMNSIZE);
            var lastCallIndex = (j+1)*(NUMCOLUMNS*COLUMNSIZE);
            if (extraCallAdded) {
                firstCallIndex += 1;
                lastCallIndex += 1;
            }
            if (this.props.draggable && this.props.dragSourceOrigin && this.props.dragSourcePosition >= firstCallIndex && this.props.dragSourcePosition < lastCallIndex) {
                lastCallIndex += 1
                extraCallAdded = true;
            }
            pages.push(
                <Page 
                    key={j} 
                    id={`${id}${j}`}
                    active={j === 0 ? "active" : ""} 
                    loading={this.props.loading}
                    columns={NUMCOLUMNS} columnSize={COLUMNSIZE}
                    callSize={callSize}
                    calls={listItems.slice(firstCallIndex, lastCallIndex)}
                />
            );
        }

        return (
            <div className={`${flexWidth}`}>
                <h4 className="list-header text-secondary">{this.props.header}</h4>
                <div id={id} className={`carousel slide d-flex justify-content-center`} data-wrap="false" data-interval="false">
                    <a className={`carousel-control-prev btn btn-secondary ${onePage ? "disabled" : ""}`} href={`#${id}`} role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <div className="carousel-inner container" style={{width: `${NUMCOLUMNS*callSize.width + 2}px`}}>
                        {placeholder || ""}
                        {pages}
                    </div>
                    <a className={`btn btn-secondary carousel-control-next ${onePage ? "disabled" : ""}`} href={`#${id}`} role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        )
    }

}

export default props => (
    <WindowContext.Consumer>
      {window => <List {...props} windowWidth={window.width} windowHeight={window.height} />}
    </WindowContext.Consumer>
  );