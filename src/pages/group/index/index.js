import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

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
                      <div className="grouplist">
                        <h1 className="title-wrapper">我的团队</h1>
                        <div className="item-group">
                          <div className="cover-group">
                            <img src={require('../../../assets/images/avatar5.jpg')}/>
                          </div>
                          <div className="info-group">
                            <p className="text-main">野原家（4）</p>
                            <p className="text-sub">无动态</p>
                          </div>
                        </div>
                        <div className="item-group">
                          <div className="cover-group">
                            <img src={require('../../../assets/images/avatar6.jpg')}/>
                          </div>
                          <div className="info-group">
                            <p className="text-main">向日葵班（6）</p>
                            <p className="text-sub">无动态</p>
                          </div>
                        </div>
                      </div>                      
                    </div>
                    <div className="right">
                        <Header />
                        <div className="group-top">
                          <div className="group-options">
                            <div className="group-btns">
                              <h1 className="title-wrapper">团队操作</h1>
                              <ul className="ul-group-btns">
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
                                  <FontAwesomeIcon icon="cogs" />
                                    <span class="list-text">团队管理</span>
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div> 

                          <div className="group-news">
                            <h1 className="title-wrapper">团队动态</h1>
                            <div className="item-news">
                              <div className="cover-news">
                                  <img src={require('../../../assets/images/avatar2.jpg')}/>
                              </div>
                              <div className="info-news">
                                <div className="bubble">
                                  <p className="name">野原向日葵</p>
                                  嗨，亲们！
                                </div>
                                <p className="date">发布于 12:09</p>
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
                                <p className="date">发布于 12:09</p>
                              </div>
                            </div>
                            <div className="item-news mine">
                              <div className="cover-news">
                                  <img src={require('../../../assets/images/avatar.jpg')}/>
                              </div>
                              <div className="info-news">
                                <div className="bubble">
                                  <p className="name">野原新之助</p>
                                  我在团队文库中添加了<a href="#">01 日记</a>这一章节。
                                </div>
                                <p className="date">发布于 12:09</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="msg-send">
                          <input type="text" placeholder="输入要发送的" className="input-msg"/>
                          <button className="btn-msg"><FontAwesomeIcon icon="paper-plane"/></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;