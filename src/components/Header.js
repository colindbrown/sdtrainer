import React from "react";
import { NavLink } from "react-router-dom";
import squareLogo from "../img/squares.png";

const Header = () => (
  <header>
    <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
      <img
        src={squareLogo}
        width="30"
        height="30"
        className="d-inline-block align-top mr-2"
        alt=""
      />
      <a className="navbar-brand" href="/">
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
            />
            <NavLinker
              relUrl="run"
              name="Run"
            />
            <NavLinker
              relUrl="review"
              name="Review"
            />
        </ul>
      </div>
    </nav>
  </header>
);

const NavLinker = ({ relUrl, name }) => {
  return (
    <li className="nav-item">
      <NavLink className="nav-link" to={`/${relUrl}`}>
        {name}
      </NavLink>
    </li>
  );
};

export default Header;