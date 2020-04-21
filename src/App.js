import React from 'react';
import './App.css';
import {Link, Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import Header from './header.js';
import About from './about.js';
import Home from './Home.js';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <nav>
          <Link to="/" className="home" >Find Busisnesses</Link>
          <Link to="/about" className="about" >About</Link>
        </nav>
        <Switch>
          <Route path="/about"><About /></Route>
          <Route path="/"><Home /></Route>
        </Switch>
      </div>
    </Router>
  );
}
