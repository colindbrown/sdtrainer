import React, { Component } from 'react';
import Header from "./components/Header";
import Home from "./components/Home";
import ClassManager from "./components/ClassManager";
import { Switch, Route, HashRouter} from "react-router-dom";
import PlanSessionView from "./components/PlanSessionView";
import RunSessionView from "./components/RunSessionView";
import ReviewClassView from "./components/ReviewClassView";
import CreateTemplateView from "./components/CreateTemplateView";
import * as db from "./util/dbfunctions";
import firebase from "firebase";
import './App.css';
import {withRouter} from "react-router";

class App extends Component {

  state = {
    activeClass: {},
    activeUser: "",
    crumb: ""
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        db.setActiveUser(user).then(() => {
          this.setState({activeUser: user});
        });
      } else {
        this.setState({activeUser: ""});
      }
    });

    this.unlisten = this.props.history.listen((location, action) => {
      this.setCrumb(location);
    });
  }

  updateActiveClass = async (name) => {
    const classData = await db.setActiveClass(name);
    this.setState({activeClass: classData});
  }

  setCrumb(location) {
    var crumb;
    switch (location.pathname) {
      case "/create":
        crumb = "Create a session plan or template";
        break;
      case "/run":
        crumb = "Run a session";
        break;
      case "/review":
        crumb = "Review and export calls";
        break;
      default:
        crumb = "";
        break;
    }
    this.setState({crumb});
  }

  signOut = () => {
    firebase.auth().signOut();
  }


  render() {
    var routes;
    if (!this.state.activeUser) {
      routes = <Route path="/" component={Home}/>
    } else if (this.state.activeClass.name) {
      routes = <div>
          <Route exact path="/" render={(routeProps) => (
            <ClassManager {...routeProps} 
              activeClass={this.state.activeClass} 
              activeUser={this.state.activeUser}
              updateActiveClass={(name) => this.updateActiveClass(name)} 
              />
          )}/>
          <Route path="/templates" component={CreateTemplateView}/>
          <Route path="/plan" component={PlanSessionView}/>
          <Route path="/run" component={RunSessionView}/>
          <Route path="/review" component={ReviewClassView}/>
        </div>
    } else {
      routes = <Switch>
        <Route path="/templates" component={CreateTemplateView}/>
        <Route path="/" render={(routeProps) => (
        <ClassManager {...routeProps} 
              activeClass={this.state.activeClass} 
              activeUser={this.state.activeUser}
              updateActiveClass={(name) => this.updateActiveClass(name)} 
              />
      )}/>
      </Switch>
    }
    var crumbs = [];
    if (this.state.activeUser) {
      crumbs.push(this.state.activeUser.displayName);
    }
    if (this.state.activeClass.name) {
      crumbs.push(this.state.activeClass.name);
    }
    if (this.state.crumb) {
      crumbs.push(this.state.crumb);
    }
    return (
      <HashRouter>
        <div className="App">
          <Header activeClass={this.state.activeClass} crumbs={crumbs} activeUser={this.state.activeUser} signOut={() => this.signOut()}/>
          {routes}
        </div>
      </HashRouter>
    );
  }
}

export default withRouter(App);
