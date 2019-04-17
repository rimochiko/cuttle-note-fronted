import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import {HomePage} from './pages/home';
import {
  LibraryPage,
  LibEditPage
} from './pages/library';
import {
  GalleryPage,
  GalleryEditPage
} from './pages/gallery';
import {GroupPage} from './pages/group';

import {SettingPage} from './pages/setting';

import {
  LoginPage,
  RegisterPage,
  InfoPage
} from './pages/user';

import {
  CollectPage,
  TrashPage
} from './pages/other';

import './assets/styles/normal.scss'

class App extends Component {
  
  constructor () {
    super();
  }

  componentWillMount() {
    // 判断路由
    
  }
  componentDidMount(){
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route path="/dashboard" component={HomePage} />
          <Route path="/library/:obj?/:owner?/:id?" component={LibraryPage} />
          <Route path="/article/edit" component={LibEditPage} />
          <Route path="/gallery" component={GalleryPage} />
          <Route path="/photo/edit" component={GalleryEditPage} />
          <Route path="/group" component={GroupPage} />
          <Route path="/register" component={RegisterPage}/>
          <Route path="/setting" component={SettingPage} />         
          <Route path="/login" component={LoginPage}/>
          <Route path="/info" component={InfoPage} />
          <Route path="/collect" component={CollectPage} />
          <Route path="/trash" component={TrashPage} />
        </Switch>
      </Router>
    );
  }
}



export default App;