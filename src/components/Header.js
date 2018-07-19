import React from "react";
import { NavLink } from "react-router-dom";
import squareLogo from "../img/logo.PNG";

const Header = ({activeClass, activeUser, signOut, crumbs}) => (
  <header>
    <nav className="navbar navbar-dark navbar-expand-lg main-bar sticky-top">
      <img
        src={squareLogo}
        width="30"
        height="30"
        className="d-inline-block align-top mr-2"
        alt=""
      />


      <div className="nav-item">
        <ol className="breadcrumb header-breadcrumbs">
          <li className="breadcrumb-item large-crumb">
            <NavLink className={`navbar-brand ml-2 mr-0`} to={`/`}>
              {activeUser ? "Square" : ""}
            </NavLink>
          </li>
          {crumbs.map((crumbMessage) => <li className="breadcrumb-item small-crumb text-info" aria-current="page">{crumbMessage}</li>)}
        </ol>
      </div>
      
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      
      {activeUser ? 
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav">
            <NavLinker
              relUrl="templates"
              name="Templates"
              active={true}
            />
            <NavLinker
              relUrl="plan"
              name="Plan"
              active={activeClass.name}
            />
            <NavLinker
              relUrl="run"
              name="Run"
              active={activeClass.name}
            />
            <NavLinker
              relUrl="review"
              name="Review"
              active={activeClass.name}
            />
        </ul>
        <div className="nav-item dropdown">
            <a className={`nav-item nav-link dropdown-toggle text-info`} href="#" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>
            <div className="dropdown-menu dropdown-menu-right">
            <button className="dropdown-item" onClick={() => signOut()}>Sign Out</button>
            </div>
        </div>
      </div>
      : ""}
    </nav>
  </header>
);

const NavLinker = ({ relUrl, name, active }) => {
  if (active) {
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