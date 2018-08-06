import React, { Component } from 'react';
import Header from "./components/Header";
import Home from "./components/Home";
import UserDashboard from "./components/UserDashboard";
import { Switch, Route, HashRouter} from "react-router-dom";
import CreateCollectionView from "./components/CreateCollectionView";
import RunSessionView from "./components/RunSessionView";
import ReviewClubView from "./components/ReviewClubView";
import Loader from "./components/Loader";
import ClubDashboard from "./components/ClubDashboard";
import { db } from "./util/dbfunctions";
import firebase from "firebase";
import './App.css';

const WindowContext = React.createContext({width: 0, height: 0});

class App extends Component {

  state = {
    activeClub: {},
    activeUser: "",
    loadingUser: true,
    windowWidth: 0,
    windowHeight: 0
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', () => this.updateWindowDimensions());
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        db.users.setActive(user).then(() => {
          this.setState({activeUser: user, loadingUser: false});
        });
      } else {
        this.setState({activeUser: "", loadingUser: false});
      }
    });
  }

  updateActiveClub = async (name) => {
    const clubData = await db.clubs.setActive(name);
    this.setState({activeClub: clubData });
  }

  resetClub = () => {
    this.setState({activeClub: {}});
  }

  signOut = () => {
    firebase.auth().signOut();
    this.resetClub();
  }

  updateWindowDimensions() {
    this.setState({ windowWidth: window.$(window).width(), windowHeight: window.$(window).height() });
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  render() {
    var routes;
    if (this.state.loadingUser) {
      routes = <Loader/>;
    } else if (!this.state.activeUser) {
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
        <WindowContext.Provider value={{width: this.state.windowWidth, height: this.state.windowHeight }} >
        <div className="App">
          <Header activeClub={this.state.activeClub} activeUser={this.state.activeUser} signOut={() => this.signOut()} resetClub={() => this.resetClub()}/>
          {routes}
        </div>
        </WindowContext.Provider>
      </HashRouter>
    );
  }
}

export default App;
export { WindowContext };