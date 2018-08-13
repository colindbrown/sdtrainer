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
import Alerts, { AlertsContext } from "./components/Alerts";
import { db } from "./util/dbfunctions";
import firebase from "firebase";
import { DragDropContext } from  "react-dnd";
import HTML5Backend from 'react-dnd-html5-backend';
import CustomDragLayer from "./components/CustomDragLayer";
import './App.css';

const WindowContext = React.createContext({width: 0, height: 0});

class App extends Component {

  state = {
    activeClub: {},
    activeUser: "",
    loadingUser: true,
    windowWidth: 0,
    windowHeight: 0,
    alert: []
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
  
  clearAlert = () => {
    this.setState({ alert: [] });
  }

  setPassedCollection = (type, name) => {
    this.setState({ passedCollection: {type: type, name: name} });
  }

  resetPassedCollection() {
    this.setState({ passedCollection: undefined });
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
              setPassedCollection={(type, name) => this.setPassedCollection(type, name)}
            />
          )}/>
          <Route path="/create" render={() => (
            <CreateCollectionView
              activeClub={this.state.activeClub}
              passedCollection={this.state.passedCollection}
              resetPassedCollection={() => this.resetPassedCollection()} 
            />
          )}/>
          <Route path="/run" render={() => (
            <RunSessionView
              passedCollection={this.state.passedCollection}
              resetPassedCollection={() => this.resetPassedCollection()} 
            />
          )}/>
          <Route path="/review" render={() => (
            <ReviewClubView
              passedCollection={this.state.passedCollection}
              resetPassedCollection={() => this.resetPassedCollection()} 
            />
          )}/>
          <Route path="/" render={() => (
            <UserDashboard
              activeClub={this.state.activeClub} 
              activeUser={this.state.activeUser}
              updateActiveClub={(name) => this.updateActiveClub(name)}
              setPassedCollection={(type, name) => this.setPassedCollection(type, name)} 
            />
          )}/>
        </Switch>
    } else {
      routes = <Switch>
        <Route path="/create" render={() => (
          <CreateCollectionView
            activeClub={this.state.activeClub}
            passedCollection={this.state.passedCollection}
            resetPassedCollection={() => this.resetPassedCollection()} 
          />
        )}/>
        <Route path="/" render={() => (
        <UserDashboard
              activeClub={this.state.activeClub} 
              activeUser={this.state.activeUser}
              updateActiveClub={(name) => this.updateActiveClub(name)}s
              setPassedCollection={(type, name) => this.setPassedCollection(type, name)} 
              />
      )}/>
      </Switch>
    }
    return (
      <HashRouter>
        <WindowContext.Provider value={{width: this.state.windowWidth, height: this.state.windowHeight }} >
        <div className="App">
          <Header activeClub={this.state.activeClub} activeUser={this.state.activeUser} signOut={() => this.signOut()} resetClub={() => this.resetClub()}/>
          {this.state.alert.text ? <Alerts alert={this.state.alert} clearAlert={() => this.clearAlert()} /> : ""}
          <AlertsContext.Provider value={{ 
            showAlert: (type, text) => {
              const alert = { type: type, text: text };
              this.setState({ alert });
            },
            clearAlert: () => {
                this.setState({ alert: {} });
            }}}>
            <CustomDragLayer/>
            {routes}
          </AlertsContext.Provider>
        </div>
        </WindowContext.Provider>
      </HashRouter>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
export { WindowContext };
