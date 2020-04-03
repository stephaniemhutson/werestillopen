import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Link, Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import AddBusinessForm from './addBusinessForm.js';
import OpenForBusinessList from './openForBusinessList.js';
import Map from './map.js';
import {MAPBOX_TOKEN} from './config.js';
import mapboxgl from 'mapbox-gl';

class App extends React.Component {
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
    super(props);
    mapboxgl.accessToken = MAPBOX_TOKEN;
  }

  render() {
    return <div>
      <Map />
      <h2>Open For Business:</h2>
      <OpenForBusinessList />
      <h2>Add your business and status</h2>
      <AddBusinessForm />
    </div>;
  }
}
