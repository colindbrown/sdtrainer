import React, { Component } from 'react';
import Header from "./components/Header";
import TestArea from "./components/TestArea";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <TestArea />
      </div>
    );
  }
}

export default App;
