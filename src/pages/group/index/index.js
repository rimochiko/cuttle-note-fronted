import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import Modal from '../../../components/modal';

import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

let optiondata = [{
  id: 2,
  text: '草稿箱',
  link: '/',
  icon: ['far','clipboard'],
}, {
  id: 3,
  text: '收藏夹',
  link: '/',
  icon: ['far','star']
}, {
  id: 4,
  text: '回收站',
  link: '/',
  icon: ['far','trash-alt']
}];

class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
          <div className="page">
                <Sidebar />
                <div className="flex-row flex-1">
                    <Modal title="添加成员">
                      <input type="text" placeholder="搜索ID"/>
                      <ul>
                        <li>
                          <img src={require('../../../assets/images/avatar.jpg')} />
                          <p>我呀我呀</p>
                        </li>
                      </ul>
                    </Modal>

                    <Modal title="团队管理">
                      
                    </Modal>


                    <Modal title="团队统计">
                      
                    </Modal>


                    <div className="left">
                      <div className="us">
                        <input type="text" placeholder="搜索人" className="us-input"/>
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

                    <div className="center flex-1 flex-column">
                        <div className="us-list flex-1">
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
                          <textarea className="msg-input"></textarea>
                          <ul className="msg-ul">
                            <li><span className="input-btn radius-btn">发送</span></li>
                            <li><span className="tool-btn"><FontAwesomeIcon icon={['far', 'smile']}/></span></li>
                            <li><span className="tool-btn"><FontAwesomeIcon icon="at"/></span></li>
                            <li><span className="tool-btn"><FontAwesomeIcon icon="paperclip"/></span></li>
                            <li><span className="tool-btn"><FontAwesomeIcon icon={['far', 'image']}/></span></li>
                          </ul>
                        </div>
                    </div>

                    <div className="other">
                      <div className="us-about">
                        <div className="cover">
                           <img src={require('../../../assets/images/avatar5.jpg')}/>
                        </div>
                        <p className="title">野原家</p>
                        <p className="des">
                          <Link to="/library"><FontAwesomeIcon icon="book" />文库</Link>
                          <Link to="/library"><FontAwesomeIcon icon="database" />统计</Link>
                          <Link to="/library"><FontAwesomeIcon icon="cogs" />设置</Link>
                        </p>
                      </div>
                      <div className="us-options">
                        <div className="us-btns">
                          <h1 className="normal-title">团队任务</h1>
                          <ul className="ul-us-btns">
                            <li><Link to="/">
                              <FontAwesomeIcon icon={['far','check-square']} />
                                <span class="list-text">完成“React Diff算法分析”</span>
                              </Link>
                            </li>
                            <li><Link to="/">
                            <FontAwesomeIcon icon={['far','check-square']} />
                                <span class="list-text">团队任务</span>
                              </Link>
                            </li>
                            <li><Link to="/">
                            <FontAwesomeIcon icon={['far','square']} />
                                <span class="list-text">团队统计</span>
                              </Link>
                            </li>
                            <li><Link to="/">
                            <FontAwesomeIcon icon={['far','square']} />
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