import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';

import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link, Switch,Route} from 'react-router-dom';

import InteractPage from './interact';
import SystemPage from './system';
import ReplyPage from './reply';

class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
          <div className="page overflow">
                <Sidebar />
                <div className="flex-column flex-scroll-y">
                    <Header />
                    <div className="flex-row flex-1">
                        <div className="left">
                            <div className="info-menu">
                                <h1 className="section-title">消息类型</h1>
                                <ul className="list-menu">
                                    <li><Link to="/info/system"><FontAwesomeIcon icon="bullhorn" /> 系统消息</Link></li>
                                    <li><Link to="/info/interact"><FontAwesomeIcon icon={['far', "thumbs-up"]} /> 互动消息</Link></li>
                                    <li><Link to="/info/reply"><FontAwesomeIcon icon={['far', "comments"]} /> 评论回复</Link></li>
                                </ul>
                            </div>
                        </div>  
                       <Switch>
                            <Route path="/info" exact component={SystemPage} />
                            <Route path="/info/system" exact component={SystemPage} />
                            <Route path="/info/interact" component={InteractPage} />
                            <Route path="/info/reply" component={ReplyPage} />
                        </Switch> 
                    </div>   
                </div>
            </div>
        );
    }
}

export default Page;