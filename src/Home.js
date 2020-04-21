import React from 'react';
import AddBusinessForm from './addBusinessForm.js';
import OpenForBusinessList from './openForBusinessList.js';
import Map from './map.js';
import {MAPBOX_TOKEN} from './config.js';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import {BASE_URL, BUSINESS_TYPES} from './constants.js';
import _ from 'lodash';

class Home extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      selectedBusiness: null,
      businesses: null,
      page: 1,
      allowLoadMore: true,
      latLongQuery: null,
      businessType: null,
      city: null,
    }
    this.checkForBusiness = this.checkForBusiness.bind(this)
    this.afterSave = this.afterSave.bind(this)
    this.afterDelete = this.afterDelete.bind(this)
    mapboxgl.accessToken = MAPBOX_TOKEN;
  }

  componentDidMount() {
    this._getBusinesses(null)
  }

  _getBusinesses = (searchQuery) => {
    let query = searchQuery
    if (this.state.latLongQuery) {
      query = searchQuery ? (
        `${searchQuery}&${this.state.latLongQuery}`
      ) : (`${this.state.latLongQuery}`);
    }
    fetch(`${BASE_URL}${query ? "?" + query : ""}`).then(res => res.json())
    .then(
      (result) => {
        this.setState({
          businesses: result.businesses,
        });
      },
      (error) => {
        this.setState({
          error,
        });
      }
    )
  }

  async checkForBusiness(result) {
    if (result.place_type.includes("poi")) {
      await fetch(`${BASE_URL}/mapid/${result.id}`).then(res => res.json())
      .then((res) => {
        if (res.business) {
          this.setState({selectedBusiness: res.business})
        } else {
          const postalCodes = result.context.filter(detail => detail.id.includes("postcode"))
          const states = result.context.filter(detail => detail.id.includes("region"))
          const cities = result.context.filter(detail => detail.id.includes("place"))

          this.setState({
            data: {
              mapboxId: result.id,
              name: result.text,
              longitude: result.geometry.coordinates[0],
              latitude: result.geometry.coordinates[1],
              address: result.properties.address,
              postalCode: postalCodes.length ? postalCodes[0].text : null,
              state: states.length ? states[0].text : null,
              city: cities.length ? cities[0].text : null,
            },
          })
        }
      })

    }
  }

  afterSave(newBusiness) {
    let businesses = [...this.state.businesses]
    businesses.push(newBusiness);
    this.setState({
      data: null,
      selectedBusiness: newBusiness,
      businesses,
    })
  }

  afterUpdate = (updatedBusiness) => {
    const businesses = []
    this.state.businesses.map(business => {
      if (business.business_id === updatedBusiness.business_id) {
        businesses.push(updatedBusiness)
      } else {
        businesses.push(business)
      }
    })
    this.setState({
      data: null,
      selectedBusiness: updatedBusiness,
      businesses,
    })
  }

  afterDelete(removedId) {
    let businesses = [...this.state.businesses]
    businesses = _.remove(businesses, biz => biz.business_id !== removedId)
    this.setState({businesses})
  }

  loadMore = () => {
    let url = `${BASE_URL}/?page=${this.state.page + 1}`
    if (this.state.latLongQuery) {
      url = `${url}&${this.state.latLongQuery}`
    }
    if (this.state.businessType) {
      url = `${url}&business_type=${this.state.businessType}`
    }
    if (this.state.city) {
      url = `${url}&city=${this.state.city}`
    }
    fetch(url).then(res => res.json())
    .then(
      (result) => {
        if (result.businesses.length === 0) {
          this.setState({
            allowLoadMore: false,
          })
        }
        let businesses = [...this.state.businesses]
        businesses = businesses.concat(result.businesses)
        this.setState({
          businesses,
          page: this.state.page + 1
        });
      },
      (error) => {
        this.setState({
          error,
        });
      }
    )
  }

  render() {
    return <div>
      <h1>Open For Business:</h1>
      <Map
        onResult={this.checkForBusiness}
        businesses={this.state.businesses}
        selectedBusiness={this.state.selectedBusiness}
        newBusiness={this.state.data}
        afterSave={this.afterSave}
        afterUpdate={this.afterUpdate}
        onViewportChange={
          (latitude, longitude, zoom) => {
            this.setState({
              latLongQuery: `lat=${latitude}&long=${longitude}&zoom=${zoom}`
            }, () => {
              this._getBusinesses(null)
            })
          }
        }
      />
      <div>
        <label for="business_type">Business Type:</label>
        <select
          name="business_type"
          onChange={(e) => {
            e.preventDefault();
            this.setState({
              allowLoadMore: true,
            })
            if (e.target.value) {
              this._getBusinesses(
                `business_type=${e.target.value}`
                )
            } else {
              this._getBusinesses(null)
            }
          }}
          >
          <option value="">Any</option>
          {BUSINESS_TYPES.map(type => {
            return <option value={type}>{type}</option>
          })}
        </select>
      </div>
      {this.state.businesses ? (
        <OpenForBusinessList
          businesses={this.state.businesses}
          afterDelete={this.afterDelete}
          onLoadMore={this.loadMore}
          allowLoadMore={this.state.allowLoadMore} />
        ) : (<div>Loading...</div>)}
    </div>;
  }
}

class NewBusiness extends React.Component {
  render() {
    return <div>
      <h2>Add your business and status</h2>
      <AddBusinessForm data={this.props.data} afterSave={this.props.afterSave} />
    </div>
  }
}

export default Home
