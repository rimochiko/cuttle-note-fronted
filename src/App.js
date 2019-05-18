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
  TrashPage,
  SearchPage
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
          <Route path="/gallery/:obj?/:owner?/:id?" component={GalleryPage} />
          <Route path="/photo/edit/:type?" component={GalleryEditPage} />
          <Route path="/group/:id?" component={GroupPage} />
          <Route path="/setting" component={SettingPage} />  
          <Route path="/info/:from?" component={InfoPage} />
          <Route path="/collect" component={CollectPage} />
          <Route path="/trash" component={TrashPage} />  
          <Route path="/search/:type/:search?/:page?" component={SearchPage} />        
          <Route path="/register" component={RegisterPage}/>   
          <Route path="/login" component={LoginPage}/>
        </Switch>
      </Router>
    );
  }
}



export default App;