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
                      <Options/>
                      <div className="imglist">
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
                        <div className="photo">
                          <div className="header">
                            <h1 className="title">学生系统E-R图</h1>
                            <div className="detail">
                                <p>
                                    <span>创建人：<a href="#">忘不掉的誓言</a></span><br/>
                                    <span>创建日期：2018-03-20 21:00:51</span>
                                </p>
                                <span><FontAwesomeIcon icon="info-circle"/></span>
                                <span><FontAwesomeIcon icon="pen"/></span>
                                <span><FontAwesomeIcon icon="trash-alt"/></span>
                            </div>
                          </div>
                          <div className="body">
                            <img src={require("../../../assets/images/img2.png")} />
                          </div>

                          <div className="footer-info">
                            <ul className="footer-ul">
                            <li><FontAwesomeIcon icon="eye"></FontAwesomeIcon> 11</li>
                            <li><FontAwesomeIcon icon="thumbs-up"></FontAwesomeIcon> 0</li>
                            </ul>
                            <ul className="footer-ul">
                            <li><FontAwesomeIcon icon="star"></FontAwesomeIcon> 收藏</li>
                            <li><FontAwesomeIcon icon="share-alt"></FontAwesomeIcon> 分享</li>
                            </ul>
                          </div>

                          <div className="comments wrapper">
                            <h1 className="section-title">我要评论</h1>
                            <div className="input-comment-box">
                            <textarea className="input-textarea"></textarea>
                            <div className="input-btn-box">
                                <input type="submit" text="提交" className="input-btn radius-btn"/>
                            </div>
                            </div>

                            <div className="list-comment-box wrapper">
                                <h1 className="section-title">全部评论（3）</h1>
                                <ul className="ul-comment-single">
                                    <li className="li-comment-single">
                                    <img src={require('../../../assets/images/avatar1.jpg')} />
                                    <div class="author-comment"> 
                                        <Link to="/">小爱公主</Link>：
                                        vue2.x采用Object.defineProperty()实现数据劫持，但是并不能劫持到数组长度变化等，是通过创建一个数组的继承类来重写pop()、push()等方法来实现对数组监听的。
                                        <span className="date"> 2019/3/18</span>
                                    </div>
                                    <span className="btn-reply">回复</span>
                                    </li>
                                    <li className="li-comment-single">
                                    <img src={require('../../../assets/images/avatar2.jpg')} />
                                    <div class="author-comment">
                                        <Link to="/">小葵</Link>：
                                        冲呀！！投票走起！！
                                        <span className="date"> 2019/3/18</span>
                                    </div>
                                    <span className="btn-reply">回复</span>
                                    </li>
                                    <li className="li-comment-single">
                                    <img src={require('../../../assets/images/avatar1.jpg')} />
                                    <div class="author-comment">
                                        <Link to="/">小爱公主</Link> 回复 <Link to="/">小葵</Link>：
                                        样式优先级那一块，内嵌、链接和导入，应该是在最后的优先级最高。
                                        <span className="date"> 2019/3/18</span>
                                    </div>
                                    <span className="btn-reply">回复</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
          </div>
        );
    }
}

export default Page;