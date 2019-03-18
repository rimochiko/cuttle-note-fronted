import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Route, Link}  from 'react-router-dom';

import {
  SetBasicPage,
  SetAccountPage
} from '..';

class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div>
                <Sidebar />
                <div className="wrapper-main">
                    <div className="wrapper-left">
                        <div className="wrapper-options">
                            <FontAwesomeIcon icon="trash-alt" />
                            <FontAwesomeIcon icon="search" /> 
                            <FontAwesomeIcon icon="folder" /> 
                        </div>

                        <div className="wrapper-menu">
                          <h1 className="title-wrapper">我的设置</h1>
                          <ul className="list-menu">
                             <li><Link to="/setting/basic"><FontAwesomeIcon icon="user" /> 基本资料</Link></li>
                             <li><Link to="/setting/account"><FontAwesomeIcon icon="unlock" /> 账户管理</Link></li>
                             <li><Link to="/setting/info"><FontAwesomeIcon icon="envelope" /> 消息设置</Link></li>
                          </ul>
                        </div>
                    </div>
                    
                      
                    <div className="wrapper-right">
                        <Header />
                        <Route exact path="/setting" component={SetBasicPage}/>
                        <Route path="/setting/basic" component={SetBasicPage} />
                        <Route path="/setting/account" component={SetAccountPage} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;