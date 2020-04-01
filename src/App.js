import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Link, Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import AddBusinessForm from './addBusinessForm.js';
import OpenForBusinessList from './openForBusinessList.js';

function App() {
  return (
    <div className="App">
        <Router>
          <Route path="/"><Home /></Route>
        </Router>
    </div>
  );
}

export default App;

function Home() {
  return <div>
    <h2>Open For Business:</h2>
    <OpenForBusinessList />
    <h2>Add your business and status</h2>
    <AddBusinessForm />
  </div>;
}
