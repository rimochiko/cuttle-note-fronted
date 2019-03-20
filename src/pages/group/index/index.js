import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import Options from '../../../layouts/options/'; 

import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

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
                      <Options />
                      <div className="us wrapper">
                        <h1 className="section-title">我的团队</h1>
                        <div className="item-us">
                          <div className="cover-us">
                            <img src={require('../../../assets/images/avatar5.jpg')}/>
                          </div>
                          <div className="info-us">
                            <p className="text-main">野原家（4）</p>
                            <p className="text-sub">无动态</p>
                          </div>
                        </div>
                        <div className="item-us">
                          <div className="cover-us">
                            <img src={require('../../../assets/images/avatar6.jpg')}/>
                          </div>
                          <div className="info-us">
                            <p className="text-main">向日葵班（6）</p>
                            <p className="text-sub">无动态</p>
                          </div>
                        </div>
                      </div>                      
                    </div>
                    <div className="right">
                        <div className="us-list">
                          <div className="header">
                              <ul className="us-people">
                                <li><img src={require('../../../assets/images/avatar2.jpg')}/></li>
                                <li><img src={require('../../../assets/images/avatar.jpg')}/></li>
                                <li><img src={require('../../../assets/images/avatar3.jpg')}/></li>
                                <li><img src={require('../../../assets/images/avatar4.jpg')}/></li>
                                <li><span className="btn-add">+</span></li>
                              </ul>
                          </div>
                          <div className="us-news">
                            
                            <div className="item-news">
                              <div className="cover-news">
                                  <img src={require('../../../assets/images/avatar2.jpg')}/>
                              </div>
                              <div className="info-news">
                                <div className="bubble">
                                  <p className="name">野原向日葵</p>
                                  嗨，亲们！
                                </div>
                                <p className="date">12:09</p>
                              </div>
                            </div>
                            <div className="item-news">
                              <div className="cover-news">
                                  <img src={require('../../../assets/images/avatar2.jpg')}/>
                              </div>
                              <div className="info-news">
                                <div className="bubble">
                                  <p className="name">野原向日葵</p>
                                  嗨，亲们！
                                </div>
                                <p className="date">12:09</p>
                              </div>
                            </div>
                            <div className="item-news mine">
                              <div className="info-news">
                                <div className="bubble">
                                  <p className="name">野原新之助</p>
                                  我在团队文库中添加了《<a href="#">React精髓</a>》这一章节。
                                </div>
                                <p className="date">12:09</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="msg-send">
                          <input type="text" placeholder="输入要发送的" className="input-msg"/>
                          <button className="btn-msg"><FontAwesomeIcon icon="paper-plane"/></button>
                        </div>
                    </div>
                    <div className="other">
                      <div className="us-about">
                        <div className="cover">
                           <img src={require('../../../assets/images/avatar5.jpg')}/>
                        </div>
                        <p className="title">野原家</p>
                        <p className="des">暂无简介</p>
                      </div>
                      <div className="us-options">
                        <div className="us-btns wrapper">
                          <h1 className="section-title">团队操作</h1>
                          <ul className="ul-us-btns">
                            <li><Link to="/">
                              <FontAwesomeIcon icon="book" />
                                <span class="list-text">团队文库</span>
                              </Link>
                            </li>
                            <li><Link to="/">
                              <FontAwesomeIcon icon="calendar" />
                                <span class="list-text">团队任务</span>
                              </Link>
                            </li>
                            <li><Link to="/">
                              <FontAwesomeIcon icon="database" />
                                <span class="list-text">团队统计</span>
                              </Link>
                            </li>
                            <li><Link to="/">
                              <FontAwesomeIcon icon="cog" />
                                <span class="list-text">团队管理</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div> 
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;