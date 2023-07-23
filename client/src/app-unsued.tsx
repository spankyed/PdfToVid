// src/App.js

import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
import Store from './shared/store';
// import App from './App';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        {/* Other routes will go here */}
      </Switch>
    </Router>
  );
}
