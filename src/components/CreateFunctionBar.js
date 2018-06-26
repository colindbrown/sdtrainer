import React from "react";

class CreateFunctionBar extends React.Component {

    state = {
        collectionName: ""
    }

    handleChange = (e) => {
        this.setState({collectionName: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.saveCollection(this.state.collectionName);
    }

    render() {

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a className="nav-link" href="#" onClick={this.props.addAllUsed}>Add all used calls</a>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Add previous Collection
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" href="#">Collections here</a>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#" onClick={this.props.removeAll}>Remove all</a>
                </li>
            </ul>
            <form className="form-inline" onSubmit={this.handleSubmit}>
                <input className="form-control mr-sm-2"placeholder="Name" value={this.state.collectionName} onChange={this.handleChange}/>
                <button className="btn btn-sm btn-outline-secondary my-2 my-sm-0" type="submit">Save Collection</button>
            </form>

            </nav>
        )
    }

}

export default CreateFunctionBar;