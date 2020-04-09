import React, {useState} from 'react';
import {MAPBOX_TOKEN} from './config.js';
// import mapboxgl from 'mapbox-gl';
// import {MapboxGeocoder} from 'mapbox-gl-geocoder';
import axios from 'axios';
import Geocoder from "react-map-gl-geocoder";
import ReactMapGL, {MapController} from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from "deck.gl";

const MAPBOX_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'

class Map extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        latitude: 32.7157,
        longitude: -117.1476,
        width: "100%",
        height: "100%",
        zoom: 10
      },
      searchResultLayer: null
    }
  }

  mapRef = React.createRef();

  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  handleOnResult = event => {
    console.log(event.result);
    this.setState({
      searchResultLayer: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10
      })
    });
  };

  render() {
    const {viewport, searchResultLayer} = this.state
    return <div className="mapContainer">
        <ReactMapGL
          {...viewport}
          ref={this.mapRef}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange={this.handleViewportChange}
          controller={new MapController()}
          onClick={e => {
            e.preventDefault()
            console.log("click!")
          }}
        >
          <Geocoder
            mapRef={this.mapRef}
            onResult={this.handleOnResult}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            position="top-left"
          />
          <DeckGL {...viewport} layers={[searchResultLayer]} />
        </ReactMapGL>
      </div>;
  }
}

export default Map
