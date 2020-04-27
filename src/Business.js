import PropTypes from 'prop-types';
import React, {useState} from 'react';

import downcarrot from './downcarrot.svg'
import upcarrot from './upcarrot.svg'

function Business(props) {
  const [showDetails, setShowDetails] = useState(false)

  const {
    name,
    is_open,
    takeout,
    online,
    delivery,
    byAppointment,
    details,
    location,
    businessType,
  } = props

  return <div className="business">
    <h3>{name}</h3>
    <p>
      {location.street_address}<br/>{location.city}, {location.state}
    </p>
    <button class="dark" onClick={() => setShowDetails(!showDetails)}>
      {showDetails ? (
        <img className="20" src={upcarrot} alt="hide details"/>
      ) : (
        <img className="20" src={downcarrot} alt="show details"/>
      )}
    </button>
    {showDetails ? <div>
      {businessType ? <p>[{businessType}]</p> : null }
      <p>Details: {details}</p>
      <ul>
        <li>Is Open: {is_open ? "Yes!" : "No"}</li>
        <li>Takeout: {takeout ? "Yes!" : "No"}</li>
        <li>Online: {online ? "Yes!" : "No"}</li>
        <li>Delivery: {delivery ? "Yes!" : "No"}</li>
        <li>Appointments: {byAppointment ? "Yes!": "No"}</li>
      </ul>
    </div> : null}
  </div>;
}

Business.propTypes = {
  name: PropTypes.string.isRequired,
  is_open: PropTypes.bool,
  takeout: PropTypes.bool,
  online: PropTypes.bool,
  delivery: PropTypes.bool,
  byAppointment: PropTypes.bool,
  details: PropTypes.string,
  location: PropTypes.object.isRequired,
  businessType: PropTypes.string,
}

export default Business
