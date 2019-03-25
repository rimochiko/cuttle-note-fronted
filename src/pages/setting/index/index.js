import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
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
            <div className="page overflow">
                <Sidebar />
                <div className="flex-column flex-1 flex-scroll-y">
                    <Header />
                    <div className="flex-row">
                        <div className="left">
                            <div className="setting-menu">
                                <h1 className="section-title">我的设置</h1>
                                <ul className="list-menu">
                                    <li><Link to="/setting/basic"><FontAwesomeIcon icon="user" /> 基本资料</Link></li>
                                    <li><Link to="/setting/account"><FontAwesomeIcon icon="unlock" /> 账户管理</Link></li>
                                    <li><Link to="/setting/info"><FontAwesomeIcon icon="envelope" /> 消息设置</Link></li>
                                </ul>
                            </div>
                        </div>         
                        <div className="set-panel flex-1">
                            <Switch>
                                <Route path="/setting" exact component={SetBasicPage} />
                                <Route path="/setting/basic" component={SetBasicPage} />
                                <Route path="/setting/account" component={SetAccountPage} />
                            </Switch>         
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default Page;