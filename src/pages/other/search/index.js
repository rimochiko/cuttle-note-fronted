import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import Loading from '../../../components/loading';
import './index.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Route, NavLink, Switch}  from 'react-router-dom';

import Article from './article';
import Chart from './chart';
import Group from './group';
import User from './user';

class Page extends Component {
    constructor () {
        super();
        this.state = {
          list: []
        }
    }

    async componentDidMount () {
       this.refs.loading.toggle();
    }

    toggleLoading () {
      this.refs.loading.toggle();
    }

    render () {
        return (
            <div className="page">
                <Sidebar />
                <div className="flex-column flex-1">
                    <Loading ref="loading" />
                    <Header />
                    <div className="flex-row">
                      <div className="left">
                        <ul className="menu-ul">
                          <li><NavLink to="/search/article" activeClassName="active">文章<span>11</span></NavLink></li>
                          <li><NavLink to="/search/chart" activeClassName="active">图<span>0</span></NavLink></li>
                          <li><NavLink to="/search/group" activeClassName="active">团队<span>0</span></NavLink></li>
                          <li><NavLink to="/search/user" activeClassName="active">用户<span>0</span></NavLink></li>
                        </ul>
                      </div>

                      <div className="flex-column flex-1">    
                        <Switch>
                            <Route path="/search/article" 
                                    exact
                                    render={(props) => (
                                    <Article
                                      {...props} 
                                      toggleLoading={this.toggleLoading.bind(this)}
                                    />)}/>
                            <Route path="/search/chart"
                                    render={(props) => (
                                    <Chart
                                      {...props} 
                                      toggleLoading={this.toggleLoading.bind(this)}
                                    />)}/>
                            <Route path="/search/group"
                                    render={(props) => (
                                    <Group
                                      {...props} 
                                      toggleLoading={this.toggleLoading.bind(this)}
                                    />)}/>
                             <Route path="/search/user"
                                    render={(props) => (
                                    <User
                                      {...props} 
                                      toggleLoading={this.toggleLoading.bind(this)}
                                    />)}/>
                        </Switch>  
                     </div>
                    
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;