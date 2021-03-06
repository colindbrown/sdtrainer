import React from "react";
import { Link, NavLink } from "react-router-dom";
import squareLogo from "../img/logo.PNG";

const Header = ({activeClub, activeUser, signOut, resetClub, loading}) => (
  <header>
    <nav className={`navbar navbar-dark navbar-expand-lg main-bar sticky-top ${activeUser || loading? "" : "bg-transparent"}`}>

       <div className="nav-item">
        <ol className="breadcrumb header-breadcrumbs">
          <li className="breadcrumb-item">
            <NavLink className={`${activeUser || loading ? "navbar-brand ml-2 mr-0" : "home-logo"}`} to={`/`} onClick={resetClub}>
            <img
              src={squareLogo}
              width="30"
              height="30"
              className={`d-inline-block align-top`}
              alt=""
            />
            {activeUser ? <div>
              <span className="text-silver">SD</span>
              <span className="text-info">Trainer</span>
            </div> 
            : ""}
            </NavLink>
          </li>
          {activeClub.name ? <li className="breadcrumb-item small-crumb text-silver" aria-current="page">{activeClub.name}</li> : ""}
        </ol>
      </div>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      
      {activeUser ?
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        {activeClub.name ? 
        <ul className="navbar-nav">
            <NavLinker
              relUrl="club"
              name="Club"
            />
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
        </ul> :
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link disabled">Club</a>
          </li>
          <NavLinker
            relUrl="create"
            name="Create"
          />
          <li className="nav-item">
            <a className="nav-link disabled">Run</a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled">Review</a>
          </li>
        </ul>
        }
        <div className="nav-item dropdown ml-2">
            <a className={`btn btn-sm btn-info`} to={'/'} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{activeUser.displayName.split(" ")[0]}</a>
            <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to={'/'} onClick={() => signOut()}>Sign Out</Link>
            </div>
        </div>
      </div>
      : ""}
    </nav>
  </header>
);

const NavLinker = ({ relUrl, name}) => {
  return (
    <li className="nav-item">
      <NavLink className={`nav-link`} to={`/${relUrl}`}>
        {name}
      </NavLink>
    </li>
  )
};

export default Header;