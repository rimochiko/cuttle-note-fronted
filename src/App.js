import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import {HomePage, DashboardPage} from './pages/home';
import {LibraryPage} from './pages/library';
import {GalleryPage} from './pages/gallery';
import {GroupPage} from './pages/group';

import {
  LoginPage,
  RegisterPage
} from './pages/user';

import './assets/styles/normal.scss'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomePage}/>
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/library" component={LibraryPage} />
          <Route path="/gallery" component={GalleryPage} />
          <Route path="/group" component={GroupPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/login" component={LoginPage} />
        </div>
      </Router>
    );
  }
}

export default App;
