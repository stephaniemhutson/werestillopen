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
    this.state = {data: null}
    this.checkForBusiness = this.checkForBusiness.bind(this)
    this.afterSave = this.afterSave.bind(this)
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

  checkForBusiness(result) {
    if (result.place_type.includes("poi")) {
      this.setState({data: {
        mapboxId: result.id,
        name: result.text,
        longitude: result.geometry.coordinates[0],
        latitude: result.geometry.coordinates[1],
        address: result.properties.address,
        postalCode: result.context[1].text,
        state: result.context[3].text,
        city: result.context[2].text
      }})
    }
  }

  afterSave(newBusiness) {
    let businesses = [...this.state.businesses]
    businesses.push(newBusiness);
    this.setState({
      data: null,
      businesses: businesses
    })
  }

  render() {
    return <div>
      <Map onResult={this.checkForBusiness} businesses={this.state.businesses} />
      <h2>Open For Business:</h2>
      <OpenForBusinessList businesses={this.state.businesses} />
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
