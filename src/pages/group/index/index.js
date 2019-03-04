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
                      <div className="wrapper-grouplist">
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
                    <div className="wrapper-right">
                        <Header />
                        <div className="wrapper-groupnews">
                          <div className="wrapper-groupnews-top">
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
                          <div className="wrapper-msgsend">
                            <input type="text" placeholder="输入要发送的" className="input-msg"/>
                            <button className="btn-msg"><FontAwesomeIcon icon="paper-plane"/></button>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;