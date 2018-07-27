import React, { Component } from 'react';
import Header from "./components/Header";
import Home from "./components/Home";
import UserDashboard from "./components/UserDashboard";
import { Switch, Route, HashRouter} from "react-router-dom";
import CreateCollectionView from "./components/CreateCollectionView";
import RunSessionView from "./components/RunSessionView";
import ReviewClubView from "./components/ReviewClubView";
import ClubDashboard from "./components/ClubDashboard";
import * as db from "./util/dbfunctions";
import firebase from "firebase";
import './App.css';

class App extends Component {

  state = {
    activeClub: {},
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

  updateActiveClub = async (name) => {
    const clubData = await db.setActiveClub(name);
    this.setState({activeClub: clubData});
  }

  resetClub = () => {
    this.setState({activeClub: {}});
  }

  signOut = () => {
    firebase.auth().signOut();
  }


  render() {
    var routes;
    if (!this.state.activeUser) {
      routes = <Route path="/" component={Home}/>
    } else if (this.state.activeClub.name) {
      routes = <Switch>
          <Route path="/club" render={(routeProps) => (
            <ClubDashboard {...routeProps} 
              activeClub={this.state.activeClub} 
              activeUser={this.state.activeUser}
              updateActiveClub={(name) => this.updateActiveClub(name)}
              resetClub={() => this.resetClub()} 
            />
          )}/>
          <Route path="/create" render={() => (
            <CreateCollectionView
              activeClub={this.state.activeClub} 
              />
          )}/>
          <Route path="/run" component={RunSessionView}/>
          <Route path="/review" component={ReviewClubView}/>
          <Route path="/" render={() => (
            <UserDashboard
              activeClub={this.state.activeClub} 
              activeUser={this.state.activeUser}
              updateActiveClub={(name) => this.updateActiveClub(name)} 
              />
          )}/>
        </Switch>
    } else {
      routes = <Switch>
        <Route path="/create" render={() => (
            <CreateCollectionView
              activeClub={this.state.activeClub} 
              />
          )}/>
        <Route path="/" render={() => (
        <UserDashboard
              activeClub={this.state.activeClub} 
              activeUser={this.state.activeUser}
              updateActiveClub={(name) => this.updateActiveClub(name)} 
              />
      )}/>
      </Switch>
    }
    return (
      <HashRouter>
        <div className="App">
          <Header activeClub={this.state.activeClub} activeUser={this.state.activeUser} signOut={() => this.signOut()} resetClub={() => this.resetClub()}/>
          {routes}
        </div>
      </HashRouter>
    );
  }
}

export default App;
