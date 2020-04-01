import React from 'react';
import {BASE_URL} from './constants.js'

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
          key={business.id}
        />
      ) : <p>No Businesses in this area</p>}
    </div>
  }
}

function Business(props) {
  const {name, is_open, takeout, online, delivery} = props
  return <div>
    <h3>{name}</h3>
    <ul>
      <li>Is Open: {is_open ? "Yes!" : "No"}</li>
      <li>Takeout: {takeout ? "Yes!" : "No"}</li>
      <li>Online: {online ? "Yes!" : "No"}</li>
      <li>Delivery: {delivery ? "Yes!" : "No"}</li>
    </ul>
  </div>;
}

export default OpenForBusinessList
