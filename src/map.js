import React, {useState} from 'react';
import {MAPBOX_TOKEN} from './config.js';
import Geocoder from "react-map-gl-geocoder";
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from "deck.gl";
import pin from './pin.svg'
import AddBusinessForm from './addBusinessForm.js';
import BusinessPopup from './BusinessPopup.js'

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
      newBusiness: this.props.newBusiness,
    }
  }

  componentDidMount() {
    if (!navigator.geolocation) {
      return
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        viewport: {
          ...this.state.viewport,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        }
      })
    }, (error) => {
      console.log(error)
    })
  }

  componentDidUpdate(nextProps) {
    const { selectedBusiness, newBusiness } = this.props
    if (nextProps.selectedBusiness !== selectedBusiness) {
      if (selectedBusiness) {
        this.setState({ selectedBusiness })
      }
    }
    if (nextProps.newBusiness !== newBusiness) {
      if (newBusiness) {
        this.setState({ newBusiness })
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

  saveBusiness = newBusiness => {
    this.setState({
      newBusiness: null,
      selectedBusiness: newBusiness,
    })
    this.props.afterSave(newBusiness)
  }

  render() {
    const {viewport, searchResultLayer, selectedBusiness, newBusiness} = this.state
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
          mapStyle='mapbox://styles/mapbox/streets-v11'
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
            className="marker"
            offsetTop={-30}
            offsetLeft={-20}
            onHover={() => this.setState({selectedBusiness: business})}
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
          {selectedBusiness && <BusinessPopup
              business={selectedBusiness}
              onClose={() => {
                this.setState({selectedBusiness: null})
              }}
            />}
          {newBusiness && <Popup
            latitude={newBusiness.latitude}
            longitude={newBusiness.longitude}
            className="popup"
            closeOnClick={false}
            offsetTop={-20}
            onClose={() => {
              this.setState({newBusiness: null})
            }}
          >
              <AddBusinessForm data={this.props.newBusiness} afterSave={this.saveBusiness} onCancel={() => this.setState({newBusiness: null})}/>
            </Popup>}
        </ReactMapGL>
      </div>;
  }
}

export default Map
