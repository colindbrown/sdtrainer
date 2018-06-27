import React from "react";
import { sampleClassRef } from "../db";

class CreateFunctionBar extends React.Component {



    render() {
        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

            <div className="navbar-nav mr-auto">
                <button className="btn btn-secondary mr-2" href="#" >Add all used calls</button>
                <div className="dropdown mr-2">
                    <a className={` btn btn-secondary dropdown-toggle`} href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Add previous collection
                    </a>
                    <div className="dropdown-menu">
                        <p>Test</p>
                    </div>
                </div>
                <button className="btn btn-secondary" href="#" >Remove all</button>
            </div>
           </nav>
        )
    }

}

export default CreateFunctionBar;