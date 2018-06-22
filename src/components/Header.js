import React from "react";
import squareLogo from "../img/squares.png";

const Header = () => (
  <header>
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <a className="navbar-brand" href="http://controltower.io">
        <img
          src={squareLogo}
          width="30"
          height="30"
          className="d-inline-block align-top mr-2"
          alt=""
        />
      </a>
      <a className="navbar-brand" href="/">
        Square
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
        </ul>
      </div>
    </nav>
  </header>
);

export default Header;