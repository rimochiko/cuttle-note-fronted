import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

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
                            <Link to="/"><FontAwesomeIcon icon="trash-alt" /></Link>
                            <Link to="/"><FontAwesomeIcon icon="search" /></Link>
                            <Link to="/"><FontAwesomeIcon icon="folder" /></Link>
                        </div>

                        <div className="menu wrapper">
                          <h1 className="section-title">快捷操作</h1>
                          <ul className="list-menu">
                             <li><Link to="/library/edit"><FontAwesomeIcon icon="edit" /> 创建新文档</Link></li>
                             <li><Link to="/gallery/edit"><FontAwesomeIcon icon="images" /> 创建新图片</Link></li>
                             <li><Link to="/friend/new"><FontAwesomeIcon icon="user-plus" /> 添加新好友</Link></li>
                          </ul>
                        </div>

                    
                        <div className="group wrapper">
                          <h1 className="section-title">我的团队</h1> 
                          <div className="item-group">
                            <div className="avatar">
                                <img src={require("../../../assets/images/avatar5.jpg")} width="45"/>
                            </div>
                            <div className="group-name">
                                <Link to="/" className="title">野原一家</Link>
                                <p className="des">我们就是很幸福的一家人</p>
                            </div>
                          </div>
                          <div className="item-group">
                            <div className="avatar">
                                <img src={require("../../../assets/images/avatar6.jpg")} width="45"/>
                            </div>
                            <div className="group-name">
                                <p className="title">向日葵班</p>
                                <p className="des">小朋友们茁壮成长</p>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className="right">
                        <Header />
                        <div className="flex-scroll-y">
                          <div className="recent wrapper">
                            <h1 className="section-title">最近活动</h1> 
                            <div className="item-recent">
                              <div className="cover">
                                <FontAwesomeIcon icon="pen" />
                              </div>
                              <div className="info">
                                <p className="date">1天前</p>
                                <p className="info">我添加了新的文章《<Link to="/">WireShark数据包</Link>》</p>
                              </div>
                            </div>
                            <div className="item-recent">
                              <div className="cover">
                                <FontAwesomeIcon icon="image" />
                              </div>
                              <div className="info">
                                <p className="date">1天前</p>
                                <p className="info">我添加了新的图画《<Link to="/">WireShark笔记图</Link>》</p>
                              </div>
                            </div>
                            <div className="item-recent">
                              <div className="cover">
                                <FontAwesomeIcon icon="pen" />
                              </div>
                              <div className="info">
                                <p className="date">2天前</p>
                                <p className="info"><Link to="/">小葵</Link> 在群 <Link to="/">野原家</Link> 中修改了文章《<Link to="/">WireShark笔记图</Link>》</p>
                              </div>
                            </div>
                          </div>

                          <div className="news wrapper">
                            <h1 className="section-title">关注动态</h1> 
                            <div className="item-news">
                              <div className="avatar">                              
                                <img src={require('../../../assets/images/avatar1.jpg')}/>
                              </div>
                              <div className="info">
                                <div className="header">
                                  <p><Link to="/" className="link">小爱公主</Link> 发布了新文章《<Link to="/" className="link">一文带你了解 Vim 的起源</Link>》</p>
                                  <span>3分钟前</span>
                                </div>
                                <div className="body">
                                  <p>我最近偶然发现了一种名为 Intel HEX 的文件格式。据我所知，Intel HEX 文件（使用.hex 扩展名）通过将二进制图像编码成十六进制数字行，使二进制图像不那么晦涩难懂。显然，当人们需要对微控制器进行编程或者将数据烧录进 ROM 时会用到这种文件。无论如何，当我第一次在 Vim 中打开一个 HEX 文件时，我发现了一些震惊的东西。至少对我来说，这种文件格式是非常深奥难懂的，但 Vim 已经掌握了它。HEX 文件的每一行都是一条被划分为不同字段的记...</p>
                                </div>
                              </div>
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