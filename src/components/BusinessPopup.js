import React from 'react';
import {Popup} from 'react-map-gl';

function BusinessPopup({business, onClose, onEdit}) {

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
          {business.is_open ? <p>We're open!</p> : null}
          {business.take_out ? <p>We offer take out</p> : null}
          {business.delivery ? <p>We deliver</p> : null}
          {business.online ? <p>We're online!</p> : null}
          <p><a href="{business.website}">{business.website}</a></p>
          {business.by_appointment ? <p>Offering service by appointment</p> : null}
          <p>{business.phone}</p>
          {business.closed ? <p>Closed until further notice</p> : null}
          <button
            onClick={(e) => {
              console.log("hello?")
              e.preventDefault();
              onEdit();
            }}>
            Edit this business
            </button>
        </Popup>
}

export default BusinessPopup
