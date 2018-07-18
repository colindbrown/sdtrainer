import React, { Component } from 'react';
import Header from "./components/Header";
import Home from "./components/Home";
import ClassManager from "./components/ClassManager";
import { Switch, Route, HashRouter} from "react-router-dom";
import PlanSessionView from "./components/PlanSessionView";
import RunSessionView from "./components/RunSessionView";
import ReviewClassView from "./components/ReviewClassView";
import CreateTemplateView from "./components/CreateTemplateView";
import ClassDashboard from "./components/ClassDashboard";
import * as db from "./util/dbfunctions";
import firebase from "firebase";
import './App.css';

class App extends Component {

  state = {
    activeClass: {},
    activeUser: ""
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
  }

  updateActiveClass = async (name) => {
    const classData = await db.setActiveClass(name);
    this.setState({activeClass: classData});
  }

  resetClass = () => {
    this.setState({activeClass: {}});
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
            <ClassDashboard {...routeProps} 
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
    return (
      <HashRouter>
        <div className="App">
          <Header activeClass={this.state.activeClass} activeUser={this.state.activeUser} signOut={() => this.signOut()} resetClass={() => this.resetClass()}/>
          {routes}
        </div>
      </HashRouter>
    );
  }
}

export default App;
