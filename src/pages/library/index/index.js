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
                          <h1 className="title-wrapper">快捷操作</h1>
                          <ul className="list-menu">
                             <li><a href="#"><FontAwesomeIcon icon="edit" /> 新文档</a></li>
                             <li><a href="#"><FontAwesomeIcon icon="file-image" /> 新图片</a></li>
                             <li><a href="#"><FontAwesomeIcon icon="user-plus" /> 加好友</a></li>
                          </ul>
                        </div>

                    
                        <div className="wrapper-group">
                          <h1 className="title-wrapper">我的团队</h1> 
                          <div className="box-group">
                            <div className="group-avatar">
                                <img src={require("../../../assets/images/avatar5.jpg")} width="45"/>
                            </div>
                            <div className="group-name">
                                <p className="title">野原一家</p>
                                <p className="des">我们就是很幸福的一家人</p>
                            </div>
                          </div>
                          <div className="box-group">
                            <div className="group-avatar">
                                <img src={require("../../../assets/images/avatar6.jpg")} width="45"/>
                            </div>
                            <div className="group-name">
                                <p className="title">向日葵班</p>
                                <p className="des">小朋友们茁壮成长</p>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className="wrapper-right">
                        <Header />
                        <div className="wrapper-static">
                           <div className="box-static">
                             <FontAwesomeIcon icon="pen-nib" />
                             <p>草稿箱 20 篇</p>
                           </div>
                           <div className="box-static">
                             <FontAwesomeIcon icon="book-open" />
                             <p>昨日阅读 10 次</p>
                           </div>
                           <div className="box-static">
                             <FontAwesomeIcon icon="comments" />
                             <p>评论 20 条</p>
                           </div>
                        </div>

                        <div className="wrapper-recent">
                          <h1 className="title-wrapper">最近编辑</h1> 
                          <div className="box-recent">
                            <a href="#">
                               <FontAwesomeIcon icon="signature" />
                               WireShark数据包
                            </a>
                            <p>李年糕 / 前端er在砌砖   2018-12-19 16:59</p>
                          </div>
                          <div className="box-recent">
                            <a href="#">
                               <FontAwesomeIcon icon="file-image" />
                               WireShark笔记图
                            </a>
                            <p>李年糕 / 前端er在砌砖   2018-12-19 16:59</p>
                          </div>
                        </div>

                        <div className="wrapper-news">
                          <h1 className="title-wrapper">关注动态</h1> 
                          <div className="box-news">
                            <div className="news-header">
                              <img src={require('../../../assets/images/avatar1.jpg')} width="32"/>
                              <a href="#" className="link-name">小爱公主</a>
                              <span>3分钟前</span>
                            </div>
                            <div className="news-body">
                              发布了新的文章<a href="#">React深入</a>。
                            </div>
                          </div>
                          <div className="box-news">
                            <div className="news-header">
                              <img src={require('../../../assets/images/avatar1.jpg')} width="32"/>
                              <a href="#" className="link-name">小爱公主</a>
                              <span>3分钟前</span>
                            </div>
                            <div className="news-body">
                              发布了新的文章<a href="#">React深入</a>。
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