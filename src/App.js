import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import {HomePage, DashboardPage} from './pages/home';
import {
  LibraryPage
} from './pages/library';
import {GalleryPage} from './pages/gallery';
import {GroupPage} from './pages/group';

import {SettingPage} from './pages/setting';

import {
  LoginPage,
  RegisterPage,
  InfoPage
} from './pages/user';

import './assets/styles/normal.scss'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomePage}/>
          <Route path="/dashboard" component={DashboardPage} />
          <Route exact path="/library" component={LibraryPage} />
          <Route exact path="/gallery" component={GalleryPage} />
          <Route exact path="/group" component={GroupPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/setting" component={SettingPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/info" component={InfoPage} />
        </div>
      </Router>
    );
  }
}

export default App;
