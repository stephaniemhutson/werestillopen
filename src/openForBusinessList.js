import React from 'react';
import {BASE_URL} from './constants.js';
import axios from 'axios';
import ConfirmModal from './confirmModal.js';
import _ from 'lodash';


class OpenForBusinessList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      error: null,
      businesses: [],
      deleteModalId: null
    }
    this.closeModal = this.closeModal.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
  }

  componentDidMount() {
    fetch(BASE_URL).then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          businesses: result.businesses,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    )
  }

  onDelete(id) {
    axios.delete(`${BASE_URL}businesses/${id}`)
    .then(function(response) {
      if (response.data.success) {
        let businesses = this.state.businesses
        _.remove(businesses, biz => biz.business_id !== id)
      }
    })
    .catch(function (error) { console.log(error)})
    this.closeModal()
  }

  confirmDelete(id) {
    this.setState({deleteModalId: id})
  }

  closeModal() {
    this.setState({deleteModalId: null})
  }

  render() {
    const {isLoaded, businesses, error, deleteModalId} = this.state;
    if (!isLoaded) {
      return <div>Loading...</div>
    }
    if (error) {
      return <div>{error}</div>
    }
    return <div>
      {deleteModalId !== null && <ConfirmModal onSumbit={() => this.onDelete(deleteModalId)} onCancel={this.closeModal}/>}
      {businesses.length ? businesses.map(
        business => <Business name={business.name}
          is_open={business.is_open}
          online={business.online}
          takeout={business.takeout}
          delivery={business.delivery}
          business_id={business.business_id}
          details={business.details}
          onDelete={this.confirmDelete}
          key={businesses.business_id}
        />
      ) : <p>No Businesses in this area</p>}
    </div>
  }
}

function Business(props) {
  const {name, is_open, takeout, online, delivery, details, onDelete, business_id} = props
  return <div>
    <h3>{name}</h3>
    <p>{details}</p>
    <ul>
      <li>Is Open: {is_open ? "Yes!" : "No"}</li>
      <li>Takeout: {takeout ? "Yes!" : "No"}</li>
      <li>Online: {online ? "Yes!" : "No"}</li>
      <li>Delivery: {delivery ? "Yes!" : "No"}</li>
    </ul>
    <button onClick={() => onDelete(business_id)} >Delete</button>
  </div>;
}

export default OpenForBusinessList
