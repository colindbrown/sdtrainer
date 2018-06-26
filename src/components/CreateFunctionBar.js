import React from "react";
import { sampleClassRef } from "../db";

class CreateFunctionBar extends React.Component {

    state = {
        newCollectionName: "",
        collectionNames: []
    }

    componentDidMount() {
        sampleClassRef.collection("Collections").get().then((snapshot) => {
            var collectionNames = [];
            snapshot.forEach(((doc) => {
                collectionNames.push(doc.data().name);
            }));
            this.setState({collectionNames});

        })
    }

    handleChange = (e) => {
        this.setState({newCollectionName: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const result = this.props.saveCollection(this.state.newCollectionName);
        if (result) {
            this.setState({ newCollectionName: "" })
        };
    }


    render() {
        const collectionListItems = this.state.collectionNames.map((name) => 
            <span className="dropdown-item" key={name} onClick={() => this.props.addCollection(name)}>{name}</span>
        );

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a className="nav-link" href="#" onClick={this.props.addAllUsed}>Add all used calls</a>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Add previous collection
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        {collectionListItems}
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#" onClick={this.props.removeAll}>Remove all</a>
                </li>
            </ul>
            <form className="form-inline" onSubmit={this.handleSubmit}>
                <input className="form-control mr-sm-2" placeholder="Name Collection" value={this.state.newCollectionName} onChange={this.handleChange}/>
                <button className="btn btn-sm btn-outline-secondary my-2 my-sm-0" type="submit">Save Collection</button>
            </form>

            </nav>
        )
    }

}

export default CreateFunctionBar;