import React from "react";
import { NavLink } from "react-router-dom";
import squareLogo from "../img/logo.PNG";

const Header = ({activeClass, activeUser, signOut}) => (
  <header>
    <nav className="navbar navbar-dark navbar-expand-lg main-bar sticky-top">
      <img
        src={squareLogo}
        width="30"
        height="30"
        className="d-inline-block align-top mr-2"
        alt=""
      />

      <NavLink className={`navbar-brand ml-2`} to={`/`}>
        {activeUser ? "Square" : ""}
      </NavLink>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      
      {activeUser ? 
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav">
            <NavLinker
              relUrl="create"
              name="Create"
              activeClass={activeClass}
            />
            <NavLinker
              relUrl="run"
              name="Run"
              activeClass={activeClass}
            />
            <NavLinker
              relUrl="review"
              name="Review"
              activeClass={activeClass}
            />
        </ul>
        <div className="dropdown">
            <a className={`nav-item nav-link dropdown-toggle text-info`} href="#" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Name
            </a>
            <div className="dropdown-menu">
            <button className="dropdown-item" onClick={() => signOut()}>Sign Out</button>
            </div>
        </div>
      </div>
      : ""}
    </nav>
  </header>
);

const NavLinker = ({ relUrl, name, activeClass }) => {
  if (activeClass.name) {
    return (
      <li className="nav-item">
        <NavLink className={`nav-link`} to={`/${relUrl}`}>
          {name}
        </NavLink>
      </li>
    )
  } else {
    return (
      <li className="nav-item">
        <a href="#" className="nav-link disabled">{name}</a>
      </li>
    )
  }
};

export default Header;