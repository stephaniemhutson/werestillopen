import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";
import PropTypes from 'prop-types';
import React from 'react';

import {MAPBOX_TOKEN} from '../config.js';
import AddBusinessForm from './AddBusinessForm.js';
import BusinessPopup from './BusinessPopup.js'
import closedpin from '../closedpin.svg'
import pin from '../pin.svg'
import {businessIsOpenAtAll} from '../helper.js'

class Map extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        latitude: 32.7157,
        longitude: -117.1476,
        width: "100%",
        height: "100%",
        zoom: 13
      },
      searchResultLayer: null,
      selectedBusiness: this.props.selectedBusiness,
      newBusiness: this.props.newBusiness,
      editingBusiness: null,
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
      this.props.onViewportChange(
        position.coords.latitude, position.coords.longitude, this.state.viewport.zoom
      )
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
    this.props.onViewportChange(viewport.latitude, viewport.longitude, viewport.zoom)
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

  saveBusiness = business => {
    this.setState({
      newBusiness: null,
      editingBusiness: null,
    })
    if (business.business_id) {
      // editing
      this.props.afterUpdate(business)
    } else {
      // saving new
      this.props.afterSave(business)
    }
  }

  render() {
    const {viewport, searchResultLayer, selectedBusiness, newBusiness, editingBusiness} = this.state
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
          maxZoom={17}
          minZoom={8}
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
              >
              <button
                onClick={e => {
                  e.preventDefault()
                  this.setState({
                    selectedBusiness: business
                  })
                }}
                className="dark">
                <img
                  className="pin"
                  src={businessIsOpenAtAll(business) ? pin : closedpin}
                  alt="map pin"
                />
              </button>
            </Marker>
          )}
          {selectedBusiness && <BusinessPopup
              business={selectedBusiness}
              onClose={() => {
                this.setState({selectedBusiness: null})
              }}
              onEdit={() => this.setState({
                editingBusiness: selectedBusiness,
                selectedBusiness: null,
              }
            )}/>}
          {editingBusiness && <Popup
            latitude={editingBusiness.location.latitude}
            longitude={editingBusiness.location.longitude}
            className="popup"
            closeOnClick={false}
            offsetTop={-20}
            onClose={() => {
              this.setState({editingBusiness: null})
            }}
          >
              <AddBusinessForm data={
                {
                  ...editingBusiness,
                  ...editingBusiness.location,
                  postalCode: editingBusiness.location.postal_code,
                  address: editingBusiness.location.street_address,
                  businessType: editingBusiness.business_type,
                  is_open: businessIsOpenAtAll(editingBusiness) ? "true" : "false",
                  appointments: editingBusiness.by_appointment,
                  take_out: editingBusiness.take_out,
                  delivery: editingBusiness.delivery,
                  online: editingBusiness.online,
                  normal: editingBusiness.is_open,
                }}
                afterSave={this.saveBusiness}
                onCancel={() => this.setState({newBusiness: null})}
              />
            </Popup>}
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

Map.propTypes = {
  newBusiness: PropTypes.object,
  selectedBusiness: PropTypes.object,
  onViewportChange: PropTypes.func.isRequired,
  onResult: PropTypes.func.isRequired,
  afterUpdate: PropTypes.func.isRequired,
  afterSave: PropTypes.func.isRequired,
  businesses: PropTypes.arrayOf(PropTypes.object),
}

export default Map
