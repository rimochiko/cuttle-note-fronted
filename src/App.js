import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import {HomePage, DashboardPage} from './pages/home';
import {LibraryPage} from './pages/library';
import './assets/styles/normal.scss'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomePage}/>
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/library" component={LibraryPage} />
        </div>
      </Router>
    );
  }
}

export default App;
