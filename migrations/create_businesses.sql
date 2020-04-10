CREATE TABLE businesses (
  business_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  is_flagged BOOLEAN DEFAULT FALSE NOT NULL,
  is_open BOOLEAN DEFAULT FALSE NOT NULL,
  take_out BOOLEAN DEFAULT FALSE NOT NULL,
  delivery BOOLEAN DEFAULT FALSE NOT NULL,
  online BOOLEAN DEFAULT FALSE NOT NULL,
  details TEXT,
  website VARCHAR(255),
  phone_number CHAR(63),
  created_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE locations (
  location_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  business_id BIGINT NOT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  mapbox_id VARCHAR(255),
  street_address VARCHAR(511),
  street_2 VARCHAR(511),
  city VARCHAR(255),
  state VARCHAR(16),
  country VARCHAR(16),
  postal_code VARCHAR(16),
  is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
  CONSTRAINT FOREIGN KEY `business_address_id` (`business_id`) REFERENCES businesses (business_id) ON DELETE CASCADE
);
