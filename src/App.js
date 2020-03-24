import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import 'bulma/css/bulma.css'
import './App.css';
import Nav from './components/Nav.js'
import Map from './components/Map.js'
import About from './components/About.js'

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Nav/>
          <Route exact path="/" component={Map} />
          <Route path="/about" component={About} />
        </div>
      </Router>
    </div>
  );
}


export default App;
