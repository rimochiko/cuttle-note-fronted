import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import Modal from '../../../components/modal';

import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link, Switch,Route} from 'react-router-dom';


class Page extends Component {
    constructor () {
        super();
        this.state = {
          members: []
        }
    }

    toggleAddBubble () {
      this.refs.addBubble.toggle();
    }

    render () {
        return (
          <div className="page overflow">
                <Sidebar />
                <div className="flex-column flex-1">
                    <Modal title="添加对话" ref="addBubble">
                    <div className="add-mem">
                        <input type="text" placeholder="搜索ID" className="input"/>
                        <ul className="ul-add-mem">
                        {
                          this.state.members&&this.state.members.map((item) => {
                            return (
                            <li key={item.id}>
                              <img src={item.avatar} title={item.name}/>
                              <p>{item.name}</p>
                            </li>  
                            )
                          })
                        }
                        </ul>
                        <div className="btns">
                          <button className="radius-btn input-btn">添加对话</button>  
                        </div>
                      </div>
                    </Modal>
                    <Header />
                    <div className="flex-row flex-1 overflow">
                        <div className="left flex-column">
                            <div className="info-nav">
                              <h1>全部信息</h1>
                              <button className="send-btn" onClick={this.toggleAddBubble.bind(this)}>
                                <FontAwesomeIcon icon="pen"></FontAwesomeIcon>
                              </button>
                            </div>
                            <div className="info-search">
                              <input type="text" placeholder="搜索信息"/>
                            </div>
                            <div className="info-user-list bg-box">
                              <Link className="info-user" to="/">
                                <div className="info-avatar">
                                  <span className="buble"></span>
                                  <img src={require('../../../assets/images/avatar.jpg')} alt=""/>
                                </div>
                                <div className="info-detail">
                                  <div className="info-header">
                                    <p>Mike Creative</p>
                                    <p className="date">3天前</p>
                                  </div>
                                  <p className="info-des">Hi！We are Educational</p>
                                </div>
                              </Link>

                            </div>
                        </div>  
                       

                        <div className="infos flex-1">
                          <div className="chat-header">
                            <p className="text">墨鱼小记</p>
                            <p className="des"><span class="logo-admin">管理员</span>我是小墨，专门负责欢迎</p>
                          </div>
                          <div className="chat-body flex-scroll-y">
                            <div className="chat-one-item">
                              <div className="item-avatar">
                                <img src={require('../../../assets/images/avatar3.jpg')} alt=""/>
                              </div>
                              <div className="item-main">
                                <div className="buble">
                                  <p>邀请你加入团队“野原家”，您是否同意？（十天内有效）</p>
                                  <button>同意加入</button>
                                </div>
                                <p className="date">上午 12:34</p>
                              </div>
                            </div>
                            <div className="chat-one-item mine">
                              <div className="item-avatar">
                                <img src={require('../../../assets/images/avatar3.jpg')} alt=""/>
                              </div>
                              <div className="item-main">
                                <div className="buble">
                                  我接受了管理员的邀请，加入了团队
                                </div>
                                <p className="date">上午 12:34</p>
                              </div>
                            </div>

                            <div className="chat-one-item">
                              <div className="item-avatar">
                                <img src={require('../../../assets/images/avatar3.jpg')} alt=""/>
                              </div>
                              <div className="item-main">
                                <div className="buble">
                                  <p>邀请你加入团队“野原家”，您是否同意？（十天内有效）</p>
                                  <button>同意加入</button>
                                </div>
                                <p className="date">上午 12:34</p>
                              </div>
                            </div>


                            <div className="chat-one-item">
                              <div className="item-avatar">
                                <img src={require('../../../assets/images/avatar3.jpg')} alt=""/>
                              </div>
                              <div className="item-main">
                                <div className="buble">
                                  <p>邀请你加入团队“野原家”，您是否同意？（十天内有效）</p>
                                  <button>同意加入</button>
                                </div>
                                <p className="date">上午 12:34</p>
                              </div>
                            </div>


                            <div className="chat-one-item">
                              <div className="item-avatar">
                                <img src={require('../../../assets/images/avatar3.jpg')} alt=""/>
                              </div>
                              <div className="item-main">
                                <div className="buble">
                                  <p>邀请你加入团队“野原家”，您是否同意？（十天内有效）</p>
                                  <button>同意加入</button>
                                </div>
                                <p className="date">上午 12:34</p>
                              </div>
                            </div>

                            <div className="chat-one-item">
                              <div className="item-avatar">
                                <img src={require('../../../assets/images/avatar3.jpg')} alt=""/>
                              </div>
                              <div className="item-main">
                                <div className="buble">
                                  <p>邀请你加入团队“野原家”，您是否同意？（十天内有效）</p>
                                  <button>同意加入</button>
                                </div>
                                <p className="date">上午 12:34</p>
                              </div>
                            </div>
                          </div>
                          <div className="chat-footer">
                            <textarea cols="3"></textarea>
                            <div className="chat-tool">
                              <div className="chat-tool-list">
                              </div>
                              <button className="radius-btn input-btn">发送</button>
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