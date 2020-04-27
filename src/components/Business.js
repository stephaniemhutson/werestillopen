import PropTypes from 'prop-types';
import React, {useState} from 'react';

import {businessIsOpenAtAll} from '../helper.js'
import downcarrot from '../downcarrot.svg'
import upcarrot from '../upcarrot.svg'

function Business(props) {
  const [showDetails, setShowDetails] = useState(false)

  const {
    name,
    isOpen,
    takeout,
    online,
    delivery,
    byAppointment,
    details,
    location,
    businessType,
  } = props

  const openAtAll = businessIsOpenAtAll(props)

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
      {openAtAll ? (
        <table className="businessInfo">
          <tr>
            <td>Open for in person business?</td>
            <td className={isOpen ? "yes" : "no"}>{isOpen ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td>Open for takeout?</td>
            <td className={takeout ? "yes" : "no"}>{takeout ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td>Open online?</td>
            <td className={online ? "yes" : "no"}>{online ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td>Open for delivery?</td>
            <td className={delivery ? "yes" : "no"}>{delivery ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td>Open by appointment?</td>
            <td className={byAppointment ? "yes" : "no"}>{byAppointment ? "Yes" : "No"}</td>
          </tr>
        </table>
      ) : (
        <table className="businessInfo">
          <tr>
            <td>Open in any capacity?</td>
            <td className="no">No</td>
          </tr>
        </table>
      )}
    </div> : null}
  </div>;
}

Business.propTypes = {
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  takeout: PropTypes.bool,
  online: PropTypes.bool,
  delivery: PropTypes.bool,
  byAppointment: PropTypes.bool,
  details: PropTypes.string,
  location: PropTypes.object.isRequired,
  businessType: PropTypes.string,
}

export default Business
