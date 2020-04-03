import React from 'react';
import {MAPBOX_TOKEN} from './config.js';
import mapboxgl from 'mapbox-gl';
// import {MapboxGeocoder} from 'mapbox-gl-geocoder';
import axios from 'axios';

const MAPBOX_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
var MapboxGeocoder = require('mapbox-gl-geocoder');
// https://api.mapbox.com/geocoding/v5/mapbox.places/92104.json?access_token=pk.eyJ1Ijoic2VhcmNoLW1hY2hpbmUtdXNlci0xIiwiYSI6ImNrN2Y1Nmp4YjB3aG4zZ253YnJoY21kbzkifQ.JM5ZeqwEEm-Tonrk5wOOMw

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // location of San Diego
      lng: -117,
      lat: 32.7157,
      zoom: 10,
    };

  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });
    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      // container: this.geocoderContainer
    });
    map.addControl(geocoder)
  }

  render() {

    return <div>
      <div className="mapContainer" ref={el => this.mapContainer = el} />
    </div>
  }
}

export default Map
