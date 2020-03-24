import React, { Component } from 'react';

import axios from 'axios';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'

import lib from '../lib/lib.js'

    let Regions
    let Departements

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {regions: [], departements:[], museums: [], mapMarkers: [], map:{}};
  }

  componentWillMount() {
    this.fetchData()
  }
  componentDidMount() {
    this.initMapbox();
    this.configureMap();
    this.createMenu();
  }

  fetchData () {
    axios.get("https://musees-francais.herokuapp.com/departements.geojson")
    .then(res => {
      console.log(res.data)
      Departements = res
      Departements.data.features = Departements.data.features.map((d, index) => {
        d.id = index+1;
        return d
      })
      this.setState({ regions: Departements.data});
    })

    axios.get("https://musees-francais.herokuapp.com/regions.geojson")
    .then(res => {
      console.log(res.data)
      Regions = res
      Regions.data.features = Regions.data.features.map((f, index) => {
        f.id = index+1;
        return f
      })
      this.setState({ departements: Regions.data });
    })

    axios.get(`https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-et-localisation-des-musees-de-france&rows=2000`)
    .then(res => {
      let museums = res.data.records;
      museums = {
        type: "FeatureCollection",
        features: museums.map(m => {
          return {
            type: 'Feature',
            geometry: m.geometry,
            properties: {
              'marker-color': '#3bb2d0',
              'marker-size': 'large'
            },
            fields: m.fields
          }
        })
      }
      this.setState({ museums });
    })
  }
  initMapbox() {
    const mapElement = document.getElementById('map');
    if (mapElement) { // only build a map if there's a div#map to inject in
      mapboxgl.accessToken = mapElement.dataset.mapboxApiKey;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [3, 47],
        zoom: 4.5
      })
      // Add geolocate control to the map.
      this.map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );

      this.setState({
        map: this.map
      });
    }
  }
  configureMap() {
    var self = this

    var map = this.map;

    var hoveredRegionId =  null;
    var hoveredDepartementId =  null;

    var convertTable = lib.convertTable

    map.on("load", function() {
      [["regions", Regions.data, hoveredRegionId], ["departements", Departements.data, hoveredDepartementId]].forEach( el => {
        map.addSource(el[0], {
          "type": "geojson",
          "data": el[1]
        });

        map.addLayer({
          "id": el[0],
          "type": "fill",
          "source": el[0],
          "paint": {
            "fill-color": "#627BC1",
            "fill-opacity": ["case",
            ["boolean", ["feature-state", "hover"], false],
            0.3,
            0.1
            ]
          },
          "filter": ["==", "$type", "Polygon"]
        });

        map.on("mousemove", el[0], function(e) {
            if (e.features.length > 0) {
                if (el[3]) {
                    map.setFeatureState({source: el[0], id: el[3]}, { hover: false});
                }
                el[3] = e.features[0].id;
                map.setFeatureState({source: el[0], id: el[3]}, { hover: true});
            }
        });

        map.on("mouseleave", el[0], function() {
            if (el[3]) {
                map.setFeatureState({source: el[0], id: el[3]}, { hover: false});
            }
            el[3] =  null;
        });

      });

      map.setLayoutProperty('departements', 'visibility', 'none');

      map.on('click', "regions", function (e) {
        console.log(e.features[0])
        let region = e.features[0]
        console.log(region.properties.nom)
        this.lastsource = this.lastsource || "";
        if (this.lastsource !== region.properties.nom) {
          var coordinates
          coordinates = region.properties.code === '52' ?  e.features[0].geometry.coordinates[1] : e.features[0].geometry.coordinates[0];
          if (coordinates.length <= 20){
            coordinates = coordinates[0]
          }
          var bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
          map.fitBounds(bounds, {
            padding: 20
          });

          let region_name = region.properties.nom
            .toUpperCase()
            .replace("É", "E")
            .replace("FRANCE", "France")

          self.clearMarkers()
          self.createMarkers(region_name, false)
          this.lastsource = region.properties.nom
        }
      });
      map.on('click', "departements", function (e) {
        console.log(e.features[0])
        let departement = e.features[0]
        console.log(departement.properties.nom)
        this.lastsource = this.lastsource || "";
        if (this.lastsource !== departement.properties.nom) {
          var coordinates =  e.features[0].geometry.coordinates[0];
          if (coordinates.length <= 20){
            coordinates = coordinates[0]
          }
          var bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
          map.fitBounds(bounds, {
            padding: 20
          });

          let departement_name = departement.properties.nom

          convertTable.forEach(e => {
            if (departement_name === e[0]) {
              departement_name =  departement_name.replace(e[0],e[1])
            }
          })

          self.clearMarkers()
          self.createMarkers(departement_name, true)
          this.lastsource = departement.properties.nom
        }
      });
    })
  }

  createMenu() {
    var map = this.map
    var toggleableLayerIds = [ 'regions', 'departements' ];
    var classes = ["active", ""]

    for (var i = 0; i < toggleableLayerIds.length; i++) {
      var id = toggleableLayerIds[i];

      var link = document.createElement('a');
      link.href = '#';
      link.className = classes[i];
      link.textContent = id;

      link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        const menu = document.getElementById("menu")
        Array.from(menu.children).forEach( child => {
          child.classList.remove('active')
          map.setLayoutProperty(child.textContent, 'visibility', 'none');
        })

        if (visibility === 'visible') {
          map.setLayoutProperty(clickedLayer, 'visibility', 'none');
          this.className = '';
        } else {
          this.className = 'active';
          map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
      };

      var layers = document.getElementById('menu');
      layers.appendChild(link);
    }

  }

  clearMarkers() {
    this.state.mapMarkers.forEach( (m) => {
      m.remove();
    })
    this.setState({ mapMarkers: [] });
  }


  createMarkers(filter, type, bypass=false) {
    var map = this.map
    if (this.state.museums.length !== 0){
      const museums = this.state.museums.features;
      museums.forEach((museum) => {
        if ( (type ? museum.fields.departement === filter : museum.fields.region === filter) && museum.geometry) {
          const popupString = `
          <div class="title is-6">
          ${museum.fields.nom_du_musee}
          </div>
          ${museum.fields.sitweb ? '<a  href="http://'+museum.fields.sitweb+'" target="_blank"> lien vers le site du musée</a>' : ""}
          ${museum.fields.telephone1 ? '<p><strong>Téléphone: </strong>'+ museum.fields.telephone1+'</p>' : ""}
          ${museum.fields.periode_ouverture ? '<p><strong>Période d\'ouverture: </strong>'+ museum.fields.periode_ouverture+'</p>' : ""}
          ${museum.fields.fermeture_annuelle ? '<p><strong>Fermeture annuelle: </strong>'+ museum.fields.fermeture_annuelle+'</p>' : ""}
          `
          const popup = new mapboxgl.Popup().setHTML(popupString);
          this.state.mapMarkers.push(new mapboxgl.Marker()
            .setLngLat([ museum.geometry.coordinates[0], museum.geometry.coordinates[1] ])
            .setPopup(popup)
            .addTo(map));
        }
      });
    }
  }


  render() {
    return (
      <div className="Map">
        <nav id="menu"/>
        <div id="map"
        data-mapbox-api-key="pk.eyJ1IjoiYWJzdHJhY3RzMzNkIiwiYSI6ImNqa2M5dzNndjJucHIzcGt5ZjZsazh0dngifQ.uthLG1JRk4Ifn_lh3O7OQQ"
        />
      </div>
    );
  }
}

export default Map;
