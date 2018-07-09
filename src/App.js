import React, { Component } from 'react';
import Header from "./components/Header";
import Home from "./components/Home";
import { Route, HashRouter} from "react-router-dom";
import CreateCollectionView from "./components/CreateCollectionView";
import RunCollectionView from "./components/RunCollectionView";
import ReviewClassView from "./components/ReviewClassView";
import * as db from "./util/dbfunctions";
import './App.css';

class App extends Component {

  state = {
    activeClass: {}
  }

  updateActiveClass = async (name) => {
    const classData = await db.setActiveClass(name);
    this.setState({activeClass: classData});
  }


  render() {
    var routes;
    if (this.state.activeClass.name) {
      routes = <div>
          <Route exact path="/" render={(routeProps) => (
            <Home {...routeProps} activeClass={this.state.activeClass} updateActiveClass={(name) => this.updateActiveClass(name)} />
          )}/>
          <Route path="/create" component={CreateCollectionView}/>
          <Route path="/run" component={RunCollectionView}/>
          <Route path="/review" component={ReviewClassView}/>
        </div>
    } else {
      routes = <Route path="/" render={(routeProps) => (
        <Home {...routeProps} activeClass={this.state.activeClass} updateActiveClass={(name) => this.updateActiveClass(name)} />
      )}/>
    }
    return (
      <HashRouter>
        <div className="App">
          <Header activeClass={this.state.activeClass} />
          {routes}
        </div>
      </HashRouter>
    );
  }
}

export default App;
