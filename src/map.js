import React, {useState} from 'react';
import {MAPBOX_TOKEN} from './config.js';
import Geocoder from "react-map-gl-geocoder";
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from "deck.gl";
import pin from './pin.svg'

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
      searchResultLayer: null,
      selectedBusiness: this.props.selectedBusiness,
    }
  }

  componentDidUpdate(nextProps) {
    const { selectedBusiness } = this.props
    if (nextProps.selectedBusiness !== selectedBusiness) {
      if (selectedBusiness) {
        this.setState({ selectedBusiness })
      }
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
    this.props.onResult(event.result)
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
    const {viewport, searchResultLayer, selectedBusiness} = this.state
    const businesses = this.props.businesses
    return <div className="mapContainer">
        <ReactMapGL
          {...viewport}
          ref={this.mapRef}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange={this.handleViewportChange}
          onClick={e => {
            e.preventDefault()
          }}
          scrollZoom={false}
        >
          <Geocoder
            mapRef={this.mapRef}
            onResult={this.handleOnResult}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            position="top-left"
            zoom={13}
            countries="US"
            limit={10}
            trackProximity={true}
          />
          <DeckGL {...viewport} layers={[searchResultLayer]} />
          {businesses && businesses.map(business => <Marker
            key={business.business_id}
            latitude={business.location.latitude}
            longitude={business.location.longitude}
              >
              <button
                onClick={e => {
                  e.preventDefault()
                  this.setState({
                    selectedBusiness: business
                  })
                }}
                className="dark"><img className="pin" src={pin} alt="map pin" /></button>
            </Marker>
          )}
          {selectedBusiness && <Popup
            latitude={selectedBusiness.location.latitude}
            longitude={selectedBusiness.location.longitude}
            onClose={() => {
              this.setState({selectedBusiness: null})
            }}
          >
              <p><b>{selectedBusiness.name}</b></p>
              <p>{selectedBusiness.address}</p>
              <p>Open: {selectedBusiness.is_open}</p>
              <p>Takeout: {selectedBusiness.take_out}</p>
              <p>Delivery: {selectedBusiness.delivery}</p>
            </Popup>}
        </ReactMapGL>
      </div>;
  }
}

export default Map
