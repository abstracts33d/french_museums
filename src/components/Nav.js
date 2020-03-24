import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Nav extends Component {

  componentDidMount() {
    document.addEventListener('DOMContentLoaded', () => {
      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
          el.addEventListener('click', () => {
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
          });
        });
      }
    });
  }

  render() {
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="https://musees-francais.theabstractconnection.com">
              <img src="favicon.png" width="28" height="28" alt="logo"/>
            </a>
            <div className="navbar-item" style={{"fontSize":"20px", "fontWeight":"bolder", "color":"black", "padding":0}}>
              Musées Francais
            </div>
            <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="mainNavBar">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="mainNavBar" className="navbar-menu">
            <div className="navbar-end">
              <Link to="/" className="navbar-item">Carte des Musées Francais</Link>
              <Link to="/about" className="navbar-item">A Propos</Link>
            </div>
          </div>
        </nav>
      );
    }
  }


export default Nav;
