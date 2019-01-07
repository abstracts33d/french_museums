import React, { Component } from 'react';

import 'bulma/css/bulma.css'
import './App.css';
import Map from './components/Map.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="#html">
              <img src="favicon.png" width="28" height="28" alt="logo"/>
            </a>
            <div className="navbar-item">
              Musées de France
            </div>
          </div>
        </nav>

        <Map/>
      </div>
    );
  }
}

export default App;
