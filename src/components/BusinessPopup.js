import React from 'react';
import {Popup} from 'react-map-gl';

import {businessIsOpenAtAll} from '../helper.js'

function BusinessPopup({business, onClose, onEdit}) {
  const openAtAll = businessIsOpenAtAll(business);

  return <Popup
            latitude={business.location.latitude}
            longitude={business.location.longitude}
            onClose={onClose}
            className="business-popup"
            offsetTop={-30}
            closeOnClick={false}
          >
          <p><b>{business.name}</b></p>
          <p>{business.location.street_address}</p>
          <p>{business.business_type ? `[${business.business_type}]` : null}</p>
          <p>{business.details}</p>
          {openAtAll ? (
            <table className="businessInfo">
              <tr>
                <td>Open for in person business?</td>
                <td className={business.is_open ? "yes" : "no"}>{business.is_open ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>Open for takeout?</td>
                <td className={business.take_out ? "yes" : "no"}>{business.take_out ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>Open online?</td>
                <td className={business.online ? "yes" : "no"}>{business.online ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>Open for delivery?</td>
                <td className={business.delivery ? "yes" : "no"}>{business.delivery ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>Open by appointment?</td>
                <td className={business.by_appointment ? "yes" : "no"}>{business.by_appointment ? "Yes" : "No"}</td>
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
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}>
            Edit this business
            </button>
        </Popup>
}

export default BusinessPopup
