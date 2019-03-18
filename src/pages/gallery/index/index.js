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
                <div className="main">
                    <div className="left">
                      <div className="options">
                        <FontAwesomeIcon icon="trash-alt" />
                        <FontAwesomeIcon icon="search" /> 
                        <FontAwesomeIcon icon="folder" /> 
                      </div>
                      <div className="imglist-box">
                        <ul className="component-img-list">
                          <li className="component-img-item">
                              <a href="#"><img src={require("../../../assets/images/img.png")} className="component-img-cover"/>
                              <p className="component-img-text">我的图片1</p></a>
                          </li>
                          <li className="component-img-item">
                              <a href="#"><img src={require("../../../assets/images/img.png")} className="component-img-cover"/>
                              <p className="component-img-text">我的图片1</p></a>
                          </li>
                          <li className="component-img-item">
                              <a href="#"><img src={require("../../../assets/images/img.png")} className="component-img-cover"/>
                              <p className="component-img-text">我的图片1</p></a>
                          </li>
                          <li className="component-img-item">
                              <a href="#"><img src={require("../../../assets/images/img.png")} className="component-img-cover"/>
                              <p className="component-img-text">我的图片1</p></a>
                          </li>
                        </ul>
                      </div>                      
                    </div>
                    <div className="right">
                        <Header />
                        <div className="photo">
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