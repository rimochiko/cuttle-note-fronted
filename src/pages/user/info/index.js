import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                             <li><a href="#"><FontAwesomeIcon icon="user" /> 基本资料</a></li>
                             <li><a href="#"><FontAwesomeIcon icon="unlock" /> 账户管理</a></li>
                             <li><a href="#"><FontAwesomeIcon icon="envelope" /> 消息设置</a></li>
                          </ul>
                        </div>
                    </div>
                    
                      
                    <div className="wrapper-right">
                        <Header />
                      
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;