import React from 'react';
import {MAPBOX_TOKEN} from './config.js';
import mapboxgl from 'mapbox-gl';

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // location of San Diego
      lng: -117,
      lat: 32.7157,
      zoom: 10
    };
  }

  componentDidMount() {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

  }

  render() {
    return <div class="mapContainer" ref={el => this.mapContainer = el} />
  }
}

export default Map
