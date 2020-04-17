import React, {useState} from 'react';
import {BASE_URL, BUSINESS_TYPES} from './constants.js'
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

  handleSubmit(event) {
    const afterSave = this.props.afterSave
    event.preventDefault()
    axios.post(BASE_URL + '/businesses', {
      name: this.state.name,
      is_open: this.state.normal == 'true',
      take_out: this.state.take_out == 'true',
      online: this.state.online == 'true',
      delivery: this.state.delivery == 'true',
      by_appointment: this.state.appointments == 'true',
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
      business_type: this.state.businessType,
    }).then(function(response) {
      afterSave(response.data.business)
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
          <input type="checkbox" checked={this.state.take_out === "true"} value={true} name="take_out" onChange={this.handleChange}/>
          <label for="take_out" >Take out?</label>
        </div>
        <div>
          <input type="checkbox"
          checked={this.state.delivery === "true"} value={true} name="delivery" onChange={this.handleChange}/>
          <label for="delivery" >Delivery?</label>
        </div>
        <div>
          <input type="checkbox" checked={this.state.appointments === "true"} value={true} name="appointments" onChange={this.handleChange}/>
          <label for="appointments" >By Appointment?</label>
        </div>
        <div>
          <input type="checkbox" checked={this.state.online === "true"} value={true} name="online" onChange={this.handleChange}/>
          <label for="online" >Order online?</label>
        </div>
        <div>
          <input type="checkbox" checked={this.state.normal === "true"} value={true} name="normal" onChange={this.handleChange}/>
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

export default AddBusinessForm;
