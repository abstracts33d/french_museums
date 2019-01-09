import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import 'bulma/css/bulma.css'
import './App.css';
import Map from './components/Map.js'

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
              <a className="navbar-item" href="#html">
                <img src="favicon.png" width="28" height="28" alt="logo"/>
              </a>
              <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="mainNavBar">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>
            </div>

            <div id="mainNavBar" class="navbar-menu">
              <div class="navbar-start">
                <Link to="/" className="navbar-item">Carte des Musées Francais</Link>
                <Link to="/about" className="navbar-item">A Propos</Link>
              </div>
            </div>

          </nav>

          <Route exact path="/" component={Map} />
          <Route path="/about" component={About} />
        </div>
      </Router>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

export default App;
