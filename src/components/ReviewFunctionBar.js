import React from "react";

class ReviewFunctionBar extends React.Component {

    render() {
        const collectionListItems = this.props.collectionNames.map((name) =>
            <button className="dropdown-item" key={name} onClick={() => this.props.selectActiveCollection(name)}>{name}</button>
        );
        const groupButtons = [...Array(7).keys()].map((number) =>
            <button className="dropdown-item" key={number} onClick={() => this.props.selectActiveGroup(number)}>Group {number + 1}</button>
        );

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <div className="dropdown mr-2">
                        <button className={` btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Filter
                        </button>
                        <div className="dropdown-menu">
                            <button className="dropdown-item" key={"used"} onClick={() => this.props.selectSortMethod("used")}>Used</button>
                            <button className="dropdown-item" key={"unused"} onClick={() => this.props.selectSortMethod("unused")}>Unused</button>
                            <button className="dropdown-item" key={"new"} onClick={() => this.props.selectSortMethod("new")}>New</button>
                        </div>
                    </div>
                    <div className="dropdown mr-2">
                        <button className={` btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Collections
                        </button>
                        <div className="dropdown-menu">
                            {collectionListItems}
                        </div>
                    </div>
                    <div className="dropdown mr-2">
                        <button className={`btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Groups
                    </button>
                        <div className="dropdown-menu">
                            {groupButtons}
                        </div>
                    </div>
                    <div className="dropdown mr-2">
                        <button className={` btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Sort by
                        </button>
                        <div className="dropdown-menu">
                        </div>
                    </div>
                </div>
                <button className={` btn btn-secondary`} data-toggle="modal" data-target="#exampleModalCenter" >Export current selection</button>
            </nav>
        )
    }

}

export default ReviewFunctionBar;