import React, { Component } from 'react';
import Header from "./components/Header";
import Home from "./components/Home";
import UserDashboard from "./components/UserDashboard";
import { Switch, Route, HashRouter} from "react-router-dom";
import CreateCollectionView from "./components/CreateCollectionView";
import RunSessionView from "./components/RunSessionView";
import ReviewClassView from "./components/ReviewClassView";
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
      routes = <Switch>
          <Route path="/class" render={(routeProps) => (
            <ClassDashboard {...routeProps} 
              activeClass={this.state.activeClass} 
              activeUser={this.state.activeUser}
              updateActiveClass={(name) => this.updateActiveClass(name)}
              resetClass={() => this.resetClass()} 
            />
          )}/>
          <Route path="/create" render={() => (
            <CreateCollectionView
              activeClass={this.state.activeClass} 
              />
          )}/>
          <Route path="/run" component={RunSessionView}/>
          <Route path="/review" component={ReviewClassView}/>
          <Route path="/" render={() => (
            <UserDashboard
              activeClass={this.state.activeClass} 
              activeUser={this.state.activeUser}
              updateActiveClass={(name) => this.updateActiveClass(name)} 
              />
          )}/>
        </Switch>
    } else {
      routes = <Switch>
        <Route path="/create" render={() => (
            <CreateCollectionView
              activeClass={this.state.activeClass} 
              />
          )}/>
        <Route path="/" render={() => (
        <UserDashboard
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
