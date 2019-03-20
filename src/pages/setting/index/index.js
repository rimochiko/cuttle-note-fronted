import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import Options from '../../../layouts/options/'; 
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Route, Link, Switch}  from 'react-router-dom';

import {
  SetBasicPage,
  SetAccountPage
} from '..';
import { SIGPWR } from 'constants';

class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="page">
                <Sidebar />
                <div className="main">
                    <div className="left">
                        <Options></Options>
                        <div className="menu wrapper">
                          <h1 className="section-title">我的设置</h1>
                          <ul className="list-menu">
                             <li><Link to="/setting/basic"><FontAwesomeIcon icon="user" /> 基本资料</Link></li>
                             <li><Link to="/setting/account"><FontAwesomeIcon icon="unlock" /> 账户管理</Link></li>
                             <li><Link to="/setting/info"><FontAwesomeIcon icon="envelope" /> 消息设置</Link></li>
                          </ul>
                        </div>
                    </div>         
                    <div className="right">
                        <Switch>
                            <Route path="/setting" exact component={SetBasicPage} />
                            <Route path="/setting/basic" component={SetBasicPage} />
                            <Route path="/setting/account" component={SetAccountPage} />
                        </Switch>         
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;