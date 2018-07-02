import React from "react";

class CreateFunctionBar extends React.Component {

    state = {
        newCollectionName: ""
    }

    handleChange = (e) => {
        this.setState({ newCollectionName: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const result = this.props.saveNewCollection(this.state.newCollectionName);
        if (result) {
            this.setState({ newCollectionName: "" });
        };
    }

    handleRemove = (e) => {
        e.preventDefault();
        this.props.removeAll();
    }


    render() {
        const collectionListItems = this.props.collectionNames.map((name) =>
            <button className="dropdown-item" key={name} onClick={() => this.props.addCollection(name)}>{name}</button>
        );

        const disableCollectionMenu = (this.props.collectionNames.length > 0) ? "" : "disabled";

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <button className="btn btn-secondary mr-2" href="#" onClick={this.props.addAllUsed}>Add all used calls</button>
                    <div className="dropdown mr-2">
                        <button className={`${disableCollectionMenu} btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Add previous collection
                    </button>
                        <div className="dropdown-menu">
                            {collectionListItems}
                        </div>
                    </div>
                    <button className="btn btn-secondary" href="#" onClick={this.handleRemove}>Remove all</button>
                </div>
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <input className="form-control mr-sm-2" placeholder="Name Collection" value={this.state.newCollectionName} onChange={this.handleChange} />
                    <button className="btn btn-sm btn-secondary my-2 my-sm-0" type="submit">Save Collection</button>
                </form>

            </nav>
        )
    }

}

export default CreateFunctionBar;