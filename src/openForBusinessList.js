import React from 'react';
import {BASE_URL} from './constants.js';
import axios from 'axios';

class OpenForBusinessList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      error: null,
      businesses: [],
    }
  }

  componentDidMount() {
    fetch(BASE_URL).then(res => res.json())
    .then(
      (result) => {
        console.log(result)
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
    .then(function(response) {console.log(response)})
    .catch(function (error) { console.log(error)})
  }

  render() {
    const {isLoaded, businesses, error} = this.state;
    if (!isLoaded) {
      return <div>Loading...</div>
    }
    if (error) {
      return <div>{error}</div>
    }
    return <div>
      {businesses.length ? businesses.map(
        business => <Business name={business.name}
          is_open={business.is_open}
          online={business.online}
          takeout={business.takeout}
          delivery={business.delivery}
          business_id={business.business_id}
          details={business.details}
          onDelete={this.onDelete}
        />
      ) : <p>No Businesses in this area</p>}
    </div>
  }
}

function Business(props) {
  const {name, is_open, takeout, online, delivery, details, onDelete, business_id} = props
  // const _onDelete = onDelete.bind(this
  console.log(business_id)
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
