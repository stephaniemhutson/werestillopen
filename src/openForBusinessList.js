import React from 'react';
import {BASE_URL} from './constants.js';
import axios from 'axios';
import ConfirmModal from './confirmModal.js';
import _ from 'lodash';


class OpenForBusinessList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      // businesses: this.props.businesses,
      deleteModalId: null,
      deleteModalName: null,
      isLoaded: true
    }
    this.closeModal = this.closeModal.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  onDelete(id) {
    const {afterDelete} = this.props
    axios.delete(`${BASE_URL}businesses/${id}`)
    .then(function(response) {
      afterDelete(id)
    })
    .catch(function (error) { console.log(error)})
    this.closeModal()
  }

  confirmDelete(id, name) {
    this.setState({
      deleteModalId: id,
      deleteModalName: name
    })
  }

  closeModal() {
    this.setState({deleteModalId: null, deleteModalName: null})
  }

  buildTable(businesses) {
    if (!businesses.length) {
      return  <p>No Businesses in this area</p>
    }
    const rows = []
    let row = []
    businesses.map((business, i) =>{
      if (i % 3 === 0) {
        if (row.length) {
          rows.push(row)
        }
        row = []
      }
      row.push(business)
    })
    rows.push(row)

    return <table className='businessList'>{
      rows.map(row => <tr>{row.map(business => <td>{business ? <Business name={business.name}
          is_open={business.is_open}
          online={business.online}
          takeout={business.take_out}
          delivery={business.delivery}
          business_id={business.business_id}
          details={business.details}
          onDelete={this.confirmDelete}
          key={businesses.business_id}
          location={business.location}
        /> : null}</td>)}</tr>)
    }</table>

  }

  render() {
    const {error, deleteModalId, deleteModalName} = this.state;

    if (error) {
      return <div>{error}</div>
    }
    return <div>
      {deleteModalId !== null && (
        <ConfirmModal
          onSumbit={() => this.onDelete(deleteModalId)}
          onCancel={this.closeModal}
          message={`Are you sure you want to delete ${deleteModalName}?`}
        />)}
      {this.buildTable(this.props.businesses)}
    </div>
  }
}

function Business(props) {
  const {name, is_open, takeout, online, delivery, details, onDelete, location, business_id} = props
  return <div>
    <h3>{name}</h3>
    <p>{details}</p>
    <p>{location.street_address}</p>
    <ul>
      <li>Is Open: {is_open ? "Yes!" : "No"}</li>
      <li>Takeout: {takeout ? "Yes!" : "No"}</li>
      <li>Online: {online ? "Yes!" : "No"}</li>
      <li>Delivery: {delivery ? "Yes!" : "No"}</li>
    </ul>
    <button onClick={() => onDelete(business_id, name)} >Delete</button>
  </div>;
}

export default OpenForBusinessList
