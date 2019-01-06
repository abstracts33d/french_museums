import React, { Component } from 'react';


import axios from 'axios';
import 'bulma/css/bulma.css'


import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {museums: [], markers: [], mapMarkers: [], query: "", map:""};
  }

  onSubmit = (event) => {
    event.preventDefault()
    axios.get(`http://localhost:3001/search?query=${this.state.query}`)
      .then(res => {
        console.log(res)
        const museums = res.data.museums;
        const markers = res.data.markers;
        this.setState({ museums, markers });
        this.clearMarkers()
        this.createMarkers();
      })
   }

  onChange =  (event) => {
    this.setState({query: event.target.value});
  }

  clearMarkers() {
    this.state.mapMarkers.forEach( (m) => {
      m.remove();
    })
    this.setState({ mapMarkers: [] });
  }

  createMarkers() {
    if (this.state.markers.length !== 0){
        const markers = this.state.markers;
        markers.forEach((marker) => {
          const popupString = `
          <div class="title is-7">
            ${marker.infoWindow.name} -
            <a  href="http://${marker.infoWindow.url}" target="_blank"> lien vers le site du musée</a>
          </div>

          <p><em>Ouverture: </em>${marker.infoWindow.openned}</p>
          <p><em>Fermeture: </em>${marker.infoWindow.closed}</p>
          <p><em>Telephone: </em>${marker.infoWindow.phone}</p>
          `
          const popup = new mapboxgl.Popup().setHTML(popupString);
          this.state.mapMarkers.push(new mapboxgl.Marker()
            .setLngLat([ marker.lng, marker.lat ])
            .setPopup(popup)
            .addTo(this.state.map));
        });
      }
  }

  initMapbox() {
    const mapElement = document.getElementById('map');

    if (mapElement) { // only build a map if there's a div#map to inject i
      mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
      this.setState({
        map: new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v10',
          center: [3, 47],
          zoom: 4.5
        })
      });

      this.createMarkers()
      // Add geolocate control to the map.
      this.state.map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
              enableHighAccuracy: true
          },
          trackUserLocation: true
      }));
    }
  }

  componentDidMount() {
    axios.get(`http://localhost:3001`)
      .then(res => {
        console.log(res)
        const museums = res.data.museums;
        const markers = res.data.markers;
        this.setState({ museums, markers });

        this.initMapbox();
      })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="#html">
              <img src="favicon.png" width="28" height="28" alt="logo"/>
            </a>

            <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
              <div className="navbar-item">
                Musées de France
              </div>
            </div>

            <div className="navbar-end">
              <div className="navbar-item">
                <form onSubmit={this.onSubmit}>
                  <div className="field has-addons">
                    <div className="control">
                      <input className="input" type="text" placeholder="Find a museum" onChange={this.onChange}/>
                    </div>
                    <div className="control">
                      <input type="submit" className="button is-dark" value="Search"/>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </nav>

        <div
          id="map"
          style={{width: "100%", height: "600px", overflow: "hidden"}}
          data-mapbox-api-key="pk.eyJ1IjoiYWJzdHJhY3RzMzNkIiwiYSI6ImNqa2M5dzNndjJucHIzcGt5ZjZsazh0dngifQ.uthLG1JRk4Ifn_lh3O7OQQ"
        >
        </div>
      </div>
    );
  }
}

export default App;
