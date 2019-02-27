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
                      <div className="wrapper-textlist-box">
                        <ul className="component-img-list">
                          <li className="component-img-item">
                              <img src={require("../../../assets/images/img.png")} className="component-img-cover"/>
                          </li>
                          <li className="component-img-item">
                              <img src={require("../../../assets/images/img.png")} className="component-img-cover"/>
                          </li>
                          <li className="component-img-item">
                              <img src={require("../../../assets/images/img.png")} className="component-img-cover"/>
                          </li>
                          <li className="component-img-item">
                              <img src={require("../../../assets/images/img.png")} className="component-img-cover"/>
                          </li>
                        </ul>
                      </div>                      
                    </div>
                    <div className="wrapper-right">
                        <Header />
                        <div className="wrapper-photo">
                          <div className="header-photo">
                            <h1 className="title">学生系统E-R图</h1>
                            <p className="date"><a href="#">忘不掉的誓言</a> 发布于 2018-03-20 21:00:51</p> 
                          </div>
                          <img src={require("../../../assets/images/img2.png")} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;