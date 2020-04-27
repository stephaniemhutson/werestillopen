import axios from 'axios';
import PropTypes from 'prop-types';
import React from 'react';

import {BASE_URL} from './constants.js';
import Business from './Business.js';
import ConfirmModal from './confirmModal.js';

class OpenForBusinessList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      deleteModalId: null,
      deleteModalName: null,
      isLoaded: true,
    }
    this.closeModal = this.closeModal.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
  }

  onDelete = id => {
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
    businesses.forEach((business, i) => {
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
          byAppointment={business.by_appointment}
          businessId={business.business_id}
          details={business.details}
          onDelete={this.confirmDelete}
          key={businesses.business_id}
          businessType={business.business_type}
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
      {this.props.allowLoadMore ? <button onClick={this.props.onLoadMore}>Load More Businesses</button> : <p>All done!</p>}
    </div>
  }
}

OpenForBusinessList.propTypes = {
  businesses: PropTypes.arrayOf(PropTypes.object).isRequired,
  afterDelete: PropTypes.func,
  allowLoadMore: PropTypes.bool,
  onLoadMore: PropTypes.func,
}

export default OpenForBusinessList
