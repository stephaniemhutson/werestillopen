import axios from 'axios';
import PropTypes from 'prop-types';
import React from 'react';

import {BASE_URL, BUSINESS_TYPES} from '../constants.js'

class AddBusinessForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      name: null,
      details: null,
      website: null,
      phone: null,
      address: null,
      normal: null,
      is_open: null,
      online: null,
      take_out: null,
      delivery: null,
      appointments: null,

      ...props.data
    }
  }

  handleSubmit = (event) => {
    const {afterSave, data} = this.props
    event.preventDefault()
    const formData = {
      name: this.state.name,
      is_open: Boolean(this.state.normal),
      take_out: Boolean(this.state.take_out),
      online: Boolean(this.state.online),
      delivery: Boolean(this.state.delivery),
      by_appointment: Boolean(this.state.appointments),
      details: this.state.details,
      website: this.state.website,
      phone_number: this.state.phone,
      longitude: data.longitude,
      latitude: data.latitude,
      postal_code: data.postalCode,
      state: data.state,
      city: data.city,
      street_address: this.state.address,
      mapbox_id: this.state.mapboxId,
      business_type: this.state.businessType,
    }
    if (data.business_id) {
      axios.put(BASE_URL + '/businesses/' + data.business_id, formData)
      .then(function(response) {
        afterSave(response.data.business)
      })
      .catch(function (error) { console.log(error)})
    } else {
      axios.post(BASE_URL + '/businesses', formData)
      .then(function(response) {
        afterSave(response.data.business)
      })
      .catch(function (error) { console.log(error)})
    }
  }

  handleChange = (event) => {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    })
  }

  handleChecked = (event) => {
    const target = event.target;
    this.setState({
      [target.name]: target.checked
    })
  }

  render() {
    return <div>
      <form onSubmit={this.handleSubmit}>
      <div className="details">
        <div>
          <label>Business Name:
          </label>
            <input
              required={true}
              name="name"
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            />
        </div>
        <div>
          <label>Type of Business:
          </label>
          <select
            required={true}
            name="businessType"
            type="text"
            value={this.state.businessType}
            onChange={this.handleChange}
          >
            {BUSINESS_TYPES.map(type => {
              return <option value={type}>{type}</option>
            })}
          </select>
        </div>
      </div>
      <div className="container">
        <div>
          <input
            type="radio"
            name="is_open"
            value={true}
            checked={this.state.is_open === "true"}
            onChange={this.handleChange}
            required={true}
          />
          <label for="is_open">Our business is open in some capacity!</label>
        <div>
        </div>
          <input
            type="radio"
            name="is_open"
            checked={this.state.is_open === "false"}
            value={false}
            onChange={this.handleChange}
          />
          <label for="is_closed">Our business is closed until further notice.</label>
        </div>
      </div>
      {this.state.is_open === "true" && <div className="container">
        <div>
          <input
            name="take_out"
            type="checkbox"
            checked={this.state.take_out}
            onChange={this.handleChecked}
          />
          <label for="take_out" >Take out?</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={this.state.delivery}
            name="delivery"
            onChange={this.handleChecked}
          />
          <label for="delivery" >Delivery?</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={this.state.appointments}
            name="appointments"
            onChange={this.handleChecked}
          />
          <label for="appointments" >By Appointment?</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={this.state.online}
            name="online"
            onChange={this.handleChecked}
            />
          <label for="online" >Order online?</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={this.state.normal}
            name="normal"
            onChange={this.handleChecked}
          />
          <label for="normal" >We're operating normally.</label>
        </div>
      </div>
      }
      <div className="details">
        <div>
          <label>Details:
          </label>
            <input
              name="details"
              type="text"
              value={this.state.details}
              onChange={this.handleChange}
            />
        </div>
        <div>
          <label>Website:
          </label>
            <input
              name="website"
              type="text"
              value={this.state.website}
              onChange={this.handleChange}
            />
        </div>
        <div>
          <label>Phone Number:
          </label>
            <input
              name="phone"
              type="text"
              value={this.state.phone}
              onChange={this.handleChange}
            />
        </div>
        <div>
          <label>Street Address:
          </label>
            <input
              required={true}
              name="address"
              type="text"
              value={this.state.address}
              onChange={this.handleChange}
            />
        </div>
        <div>
          <label>City:
          </label>
            <input
              required={true}
              name="city"
              type="text"
              value={this.state.city}
              onChange={this.handleChange}
            />
        </div>
        <div>
          <label>Postal Code:
          </label>
            <input
              required={true}
              name="postalCode"
              type="text"
              value={this.state.postalCode}
              onChange={this.handleChange}
            />
        </div>
        <div>
          <label>State:
          </label>
            <input
              required={true}
              name="state"
              type="text"
              value={this.state.state}
              onChange={this.handleChange}
            />
        </div>
      </div>
      <div>
        <input type="submit" />
        <button onClick={this.props.onCancel} >Cancel</button>
      </div>
    </form>
    </div>
  }
}

AddBusinessForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  afterSave: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default AddBusinessForm;
