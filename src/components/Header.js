import React from "react";
import { NavLink } from "react-router-dom";
import squareLogo from "../img/squares.png";

const Header = ({activeClass}) => (
  <header>
    <nav className="navbar navbar-dark navbar-expand-lg main-bar">
      <img
        src={squareLogo}
        width="30"
        height="30"
        className="d-inline-block align-top mr-2"
        alt=""
      />
      <a className="navbar-brand ml-2" href="/">
        Square
      </a>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

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
      </div>
    </nav>
  </header>
);

const NavLinker = ({ relUrl, name, activeClass }) => {
  const active = activeClass.name ? "" : "disabled";
  return (
    <li className="nav-item">
      <NavLink className={`nav-link ${active}`} to={activeClass.name ? `/${relUrl}` : '/'}>
        {name}
      </NavLink>
    </li>
  );
};

export default Header;