import React, { Component } from 'react';
import Header from "./components/Header";
import TestArea from "./components/TestArea";
import { Route, HashRouter} from "react-router-dom";
import CreateCollectionView from "./components/CreateCollectionView";
import RunCollectionView from "./components/RunCollectionView";
import ReviewClassView from "./components/ReviewClassView";
import './App.css';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className="App">
          <Header />
          <div>
            <Route exact path="/" component={TestArea}/>
            <Route path="/create" component={CreateCollectionView}/>
            <Route path="/run" component={RunCollectionView}/>
            <Route path="/review" component={ReviewClassView}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
