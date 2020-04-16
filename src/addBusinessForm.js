import React, {useState} from 'react';
import {BASE_URL, STATUSES} from './constants.js'
import _ from 'lodash';
import axios from 'axios';

class AddBusinessForm extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleMultiselect = this.handleMultiselect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      name: null,
      openStatus: [],
      details: null,
      website: null,
      phone: null,
      address: null,
      ...this.props.data
    }
  }

  handleSubmit(event) {
    const afterSave = this.props.afterSave
    event.preventDefault()
    axios.post(BASE_URL + '/businesses', {
      name: this.state.name,
      is_open: this.state.openStatus.includes("OPEN"),
      take_out: this.state.openStatus.includes("TAKEOUT"),
      online: this.state.openStatus.includes("ONLINE"),
      delivery: this.state.openStatus.includes("DELIVERY"),
      details: this.state.details,
      website: this.state.website,
      phone_number: this.state.phone,
      longitude: this.props.data.longitude,
      latitude: this.props.data.latitude,
      postal_code: this.props.data.postalCode,
      state: this.props.data.state,
      city: this.props.data.city,
      street_address: this.state.address,
      mapbox_id: this.state.mapboxId,
    }).then(function(response) {
      afterSave(response.data.new_business)
    })
    .catch(function (error) { console.log(error)})
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    })
  }

  handleMultiselect(event) {
    const target = event.target;
    const targetValue = target.value;
    const name = target.name;
    let value;
    if (this.state[name].includes(targetValue)) {
      value = _.remove(this.state[name], x => x !== targetValue)
    } else {
      value = this.state[name].concat([targetValue])
    }

    this.setState({
      [target.name]: value
    })
  }

  render() {
    const statuses = STATUSES.map((values) =>
      <option value={values[0]}>{values[1]}</option>
    )
    return <div>
      <form onSubmit={this.handleSubmit}>
      <div>
        <label>Business Name:
          <input
            required={true}
            name="name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </label>
      </div>
      <div>
        <label>Open status:
          <select
            name="openStatus"
            multiple={true}
            type="checkbox"
            value={this.state.openStatus}
            onChange={this.handleMultiselect}
          >
            {statuses}
          </select>
        </label>
      </div>
      <div>
        <label>Details:
          <input
            name="details"
            type="text"
            value={this.state.details}
            onChange={this.handleChange}
          />
        </label>
      </div>
      <div>
        <label>Website:
          <input
            name="website"
            type="text"
            value={this.state.website}
            onChange={this.handleChange}
          />
        </label>
      </div>
      <div>
        <label>Phone Number:
          <input
            name="phone"
            type="text"
            value={this.state.phone}
            onChange={this.handleChange}
          />
        </label>
      </div>
      <div>
        <label>Street Address:
          <input
            required={true}
            name="address"
            type="text"
            value={this.state.address}
            onChange={this.handleChange}
          />
        </label>
      </div>
      <div>
        <label>City:
          <input
            required={true}
            name="city"
            type="text"
            value={this.state.city}
            onChange={this.handleChange}
          />
        </label>
      </div>
      <div>
        <label>Postal Code:
          <input
            required={true}
            name="postalCode"
            type="text"
            value={this.state.postalCode}
            onChange={this.handleChange}
          />
        </label>
      </div>
      <div>
        <label>State:
          <input
            required={true}
            name="state"
            type="text"
            value={this.state.state}
            onChange={this.handleChange}
          />
        </label>
      </div>
      <div>
        <input type="submit" />
      </div>
    </form>
    </div>
  }
}

export default AddBusinessForm;
