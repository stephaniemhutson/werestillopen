import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Link, Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import AddBusinessForm from './addBusinessForm.js';
import OpenForBusinessList from './openForBusinessList.js';
import Map from './map.js';
import {MAPBOX_TOKEN} from './config.js';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import {BASE_URL} from './constants.js';
import _ from 'lodash';

class App extends React.Component {
  constructor(props) {
    super(props);
    mapboxgl.accessToken = MAPBOX_TOKEN;
  }

  render() {
    return (
      <div className="App">
        <header>
          <script src='https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.js'></script>
          <link href='https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.css' rel='stylesheet' />
        </header>
        <Router>
          <Route path="/"><Home /></Route>
        </Router>
      </div>
    );
  }
}

export default App;

class Home extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      selectedBusiness: null,
      businesses: null,
    }
    this.checkForBusiness = this.checkForBusiness.bind(this)
    this.afterSave = this.afterSave.bind(this)
    this.afterDelete = this.afterDelete.bind(this)
  }

  componentDidMount() {
    fetch(BASE_URL).then(res => res.json())
    .then(
      (result) => {
        this.setState({
          businesses: result.businesses,
        });
      },
      (error) => {
        this.setState({
          error,
        });
      }
    )
  }

  async checkForBusiness(result) {
    if (result.place_type.includes("poi")) {
      await fetch(`${BASE_URL}/mapid/${result.id}`).then(res => res.json())
      .then((res) => {
        if (res.business) {
          this.setState({selectedBusiness: res.business})
        } else {
          const postalCodes = result.context.filter(detail => detail.id.includes("postcode"))
          const states = result.context.filter(detail => detail.id.includes("region"))
          const cities = result.context.filter(detail => detail.id.includes("place"))

          this.setState({data: {
            mapboxId: result.id,
            name: result.text,
            longitude: result.geometry.coordinates[0],
            latitude: result.geometry.coordinates[1],
            address: result.properties.address,
            postalCode: postalCodes.length ? postalCodes[0].text : null,
            state: states.length ? states[0].text : null,
            city: cities.length ? cities[0].text : null,
          }})
        }
      })

    }
  }

  afterSave(newBusiness) {
    let businesses = [...this.state.businesses]
    businesses.push(newBusiness);
    this.setState({
      data: null,
      businesses,
    })
  }

  afterDelete(removedId) {
    let businesses = [...this.state.businesses]
    businesses = _.remove(businesses, biz => biz.business_id !== removedId)
    this.setState({businesses})
  }

  render() {
    return <div>
      <Map
        onResult={this.checkForBusiness}
        businesses={this.state.businesses}
        selectedBusiness={this.state.selectedBusiness}
      />
      <h2>Open For Business:</h2>
      {this.state.businesses ? (
        <OpenForBusinessList businesses={this.state.businesses} afterDelete={this.afterDelete} />
        ) : (<div>Loading...</div>)}
      {this.state.data && <NewBusiness data={this.state.data} afterSave={this.afterSave} />}
    </div>;
  }
}

class NewBusiness extends React.Component {
  render() {
    return <div>
      <h2>Add your business and status</h2>
      <AddBusinessForm data={this.props.data} afterSave={this.props.afterSave} />
    </div>
  }
}
