import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import Modal from '../../../components/modal';
import Loading from '../../../components/loading';

import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link, Switch,Route} from 'react-router-dom';

import Qlquery from './graphql';

import { inject, observer } from 'mobx-react';
import Tooltip from '../../../components/tooltip';

@inject('userStore', 'postStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          users: [],
          infos: [],
          user: {
            id: '',
            nickname: '',
            des: '',
            avatar: '',
          },
          members: [],
          searchId: '',
          sendText: ''
        }
        this.generateExtraContent = this.generateExtraContent.bind(this);
    }

    async componentDidMount () {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
        return;
      }
      document.title = "我的消息 - 墨鱼笔记"

      // 获取数据
      let from = this.props.match.params && this.props.match.params.from;
      await this.getInfoList();
      await this.getUserInfo(from);
      this.refs.loading.toggle();
    }
    
    // 获取来往用户列表
    async getInfoList () {
      // 判断有没有URL，没有就默认设置为第一个
      let userStore = this.props.userStore;
      await Qlquery.getInfoList({
        userId: userStore.user.userId,
        token: userStore.user.token
      })
      .then(({data}) => {
        let res = data.data.data;
        if (res.code === 1) {
          // 请求成功
          this.setState({
            users: res.infos
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
    
    // 获取用户消息
    async getUserInfo (from) {
      let userStore = this.props.userStore;
      let fromUser = from || this.state.users[0] && this.state.users[0].from.id;
      let user = null;

      if(!fromUser) return;
      // 获取USER信息
      let users = this.state.users;
      for(let i = 0,len = users.length; i < len; i++) {
        if (users[i].from.id === fromUser) {
          user = users[i].from;
          break;
        }
      }

      if(!user) return;
      // 请求第一个
      if(fromUser) {
        await Qlquery.getUserInfo({
          userId: userStore.user.userId,
          token: userStore.user.token,
          fromId: fromUser
        })
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            // 请求成功
            this.setState({
              infos: res.infos,
              user: user
            });
          }
        })
      }
    }

    async componentWillUpdate(nextProps) {
      let prevMatch = this.props.match.params;
      let nextMatch = nextProps.match.params
      if (prevMatch === nextMatch) {
        return;
      }
      let nextFrom = nextMatch.from || (this.state.users[0] && this.state.users[0].from.id);
      let prevFrom = prevMatch.from || (this.state.users[0] && this.state.users[0].from.id);
      console.log(nextFrom, prevFrom);
      if (!nextFrom) {
        await this.getInfoList();
        await this.getUserInfo(nextFrom);
      } else if (nextFrom !== prevFrom) {
        await this.getUserInfo(nextFrom);
      }    
   }
    
   /**
    * 添加用户对话框
    */
    toggleAddBubble () {
      this.setState({
        searchId: ''
      });
      this.refs.addBubble.toggle();
    }
    
    /**
     * 搜索用户
     */
    async searchMembers () {
      let userStore = this.props.userStore;
      await Qlquery.searchUsers({
        userId: userStore.user.userId,
        token: userStore.user.token,
        search: this.state.searchId
      })
      .then(({data}) => {
        let res = data.data.data;
        if (res.code === 1) {
          this.setState({
            members: res.users
          })
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
    
    /**
     * 发送消息
     */
    async sendMessage () {
      let userStore = this.props.userStore;
      let fromId =  this.props.match.params.from || (this.state.users[0] && this.state.users[0].from.id);
      await Qlquery.sendMessage({
        userId: userStore.user.userId,
        token: userStore.user.token,
        objectId: fromId,
        content: this.state.sendText
      })
      .then(({data}) => {
        let res = data.data.data;
        if (res.code === 1) {
          // 发送成功
          this.setState({
            infos: [
              ...this.state.infos,
              res.info
            ],
            sendMessage: ''
          });
        }
      })
    }
   
    /**
     * 接受团队邀请
     */
    acceptGroupInvite (infoId) {
      let userStore = this.props.userStore;

      Qlquery.acceptInvite({
        userId: userStore.user.userId,
        token: userStore.user.token,
        infoId: infoId
      })
      .then(({data}) => {
        let res = data.data.data;
        if(res === 1) {
          this.setState({
            tipText: '成功接受邀请'
          })
        } else {
          this.setState({
            tipText: '接受邀请失败:('
          })
        }
        this.refs.tooltip.show();
      })
      .catch((err) => {
        console.log(err)
      })
    }

    /**
     * 生成消息主题
     */
    generateExtraContent(id, type) {
      // 团队邀请通知
      if (type === 22) {
        return (
          <div className="btn-group">
            <button onClick={this.acceptGroupInvite.bind(this, id)}>接受邀请</button>
          </div> 
        );
      };

    }

    render () {
        return (
          <div className="page overflow">
                <Loading ref="loading"/>
                <Tooltip ref="tooltip" text={this.state.tipText}/>
                <Sidebar />
                <div className="flex-column flex-1">
                    <Modal title="添加对话" ref="addBubble">
                    <div className="add-mem">
                        <input type="text"
                               placeholder="搜索ID" 
                               className="input"
                               onChange={(e) => {
                                 this.setState({
                                   searchId: e.target.value
                                 });
                                 this.searchMembers();
                               }}/>
                        <ul className="ul-add-mem">
                        {
                          this.state.members&&this.state.members.map((item) => {
                            return (
                            <li key={item.id}>
                              <img src={`http://localhost:8080/static/user/${item.avatar}` || require('../../../assets/images/default.jpg')} title={item.nickname}/>
                              <p>{item.nickname}({item.id})</p>
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
                            {
                              this.state.users && this.state.users.map((item) => {
                                return (
                                  <Link className="info-user" 
                                        to={`/info/${item.from.id}`} 
                                        key={item.from.id}>
                                    <div className="info-avatar">
                                      {item.status === 1 ? <span className="buble"></span> : '' }
                                      <img 
                                        src={`http://localhost:8080/static/user/${item.from.avatar}` || require('../../../assets/images/default.jpg')}
                                        alt={item.from.nickname}/>
                                    </div>
                                    <div className="info-detail">
                                      <div className="info-header">
                                        <p>{item.from.nickname}</p>
                                        <p className="date">{item.date}</p>
                                      </div>
                                      <p className="info-des">{item.content}</p>
                                    </div>
                                  </Link>                                  
                                )
                              })
                            }
                            </div>
                        </div>  
                       

                        <div className="infos flex-1">
                          <div className="chat-header">
                            <p className="text">{this.state.user.nickname}</p>
                            <p className="des">{this.state.user.des}</p>
                          </div>
                          <div className="chat-body flex-scroll-y">
                          {
                            this.state.infos.map((item) => {
                              if (item.from.id === this.state.user.id) {
                                return (
                                  <div className="chat-one-item" key={item.id}>
                                    <div className="item-avatar">
                                    <img src={`http://localhost:8080/static/user/${item.from.avatar}` || require('../../../assets/images/default.jpg')}
                                         alt={item.from.nickname}/>
                                    </div>
                                    <div className="item-main">
                                      <div className="buble">
                                        {item.content}
                                        {this.generateExtraContent(item.id,item.type)}
                                      </div>
                                      <p className="date">{item.date}</p>
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="chat-one-item mine" key={item.id}>
                                    <div className="item-avatar">
                                    <img src={`http://localhost:8080/static/user/${item.from.avatar}` || require('../../../assets/images/default.jpg')}
                                         alt={item.from.nickname}/>
                                    </div>
                                    <div className="item-main">
                                      <div className="buble">
                                        {item.content}
                                      </div>
                                      <p className="date">{item.date}</p>
                                    </div>
                                  </div>
                                )
                              }
                            })
                          }                         
                          </div>

                          <div className="chat-footer">
                            <textarea cols="3" onChange={(e) => {
                              this.setState({
                                sendText: e.target.value
                              })
                            }}></textarea>
                            <div className="chat-tool">
                              <div className="chat-tool-list">
                              </div>
                              <button className="radius-btn input-btn"
                                      onClick={this.sendMessage.bind(this)}>发送</button>
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