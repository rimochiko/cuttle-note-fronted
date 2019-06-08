import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import Modal from '../../../components/modal';
import Loading from '../../../components/loading';

import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

import Qlquery from './graphql';

import { inject, observer } from 'mobx-react';
import Tooltip from '../../../components/tooltip';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

@inject('userStore')
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
          sendText: '',
          selectUser: {
            id: '',
            nickname: '',
            avatar: '',
          },
          selectText: ''
        }
        this.generateExtraContent = this.generateExtraContent.bind(this);
        this.generateInfoAdd = this.generateInfoAdd.bind(this);
        this.generateBubble = this.generateBubble.bind(this);
        this.generateList = this.generateList.bind(this);
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
      this.scrollToBottom();
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
        let response = data.data.data;
        if (response.code === 0) {
          // 请求成功
          this.setState({
            users: response.result
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
      let fromUser = from || (this.state.users[0] && this.state.users[0].from.id);
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
          let response = data.data.data;
          if (response.code === 0) {
            // 请求成功
            console.log(response);
            this.setState({
              infos: response.result,
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
      if (!nextFrom) {
        await this.getInfoList();
        await this.getUserInfo(nextFrom);
      } else if (nextFrom !== prevFrom) {
        await this.getUserInfo(nextFrom);
      }    
      this.scrollToBottom();
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
    async searchMembers (e) {
      let userStore = this.props.userStore;
      let search = e.target.value;

      if (!this.state.searchId) {
        await Qlquery.searchUsers({
          userId: userStore.user.userId,
          token: userStore.user.token,
          search: search
        })
        .then(({data}) => {
          let response = data.data.data;
          if (response.code === 0) {
            this.setState({
              members: response.result
            })
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            members: []
          })
        })
      } else {
        this.setState({
          members: []
        })
      }
    }

    /**
     * 滚动到底部
     */
    scrollToBottom () {
      let chatbox = this.refs.chatbox;
      if (chatbox) {
        chatbox.scrollTop = chatbox.scrollHeight
      }
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
        let response = data.data.data;
        if (response.code === 0) {
          // 发送成功
          this.setState({
            infos: [
              ...this.state.infos,
              response.result
            ],
            sendText: ''
          });
          this.scrollToBottom();
        } else {
          this.showTooltip(response.msg, "发送消息失败:(")
        }
      })        
    }

    showTooltip (text, unknown="电波传达失败:(") {
      this.setState({
        tipText: text || unknown
      })
      this.refs.tooltip && this.refs.tooltip.show();
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
        let response = data.data.data;
        if(response.code === 0) {
          this.showTooltip("成功接受邀请");
          // 如果要显示的话，还得后台返回消息数据
        } else {
          this.showTooltip(response.msg || "接受邀请失败:(")
        }
      })
      .catch((err) => {
        this.showTooltip("接受邀请失败:(")
      })
    }

    /**
     * 生成消息主题
     */
    generateExtraContent(id, type, detail) {
      // 团队邀请通知
      if (type === 22) {
        return (
          <div className="btn-group">
            <button onClick={this.acceptGroupInvite.bind(this, id)}>接受邀请</button>
          </div> 
        );
      };

      if (type === 8 && detail) {
        let obj = JSON.parse(detail);
        return (
          <div className="info-replenish">
            <p><span className="label">我评论了你的文章</span>(<Link to={`${obj.type ? "library":"gallery"}/${obj.link}`}>{obj.title}</Link>)</p>
          </div>
        )
      }

      if (type === 14 && detail) {
        let obj = JSON.parse(detail);
        return (
          <div className="info-replenish">
            <p><span className="label">我回复了你的评论：{obj.refComment}</span>(<Link to={`${obj.type ? "library":"gallery"}/${obj.link}`}>{obj.title}</Link>)</p>
          </div>
        )
      }
    }

    selectInfoUser (id, nickname, avatar) {
      let user = {
        id: id,
        nickname: nickname,
        avatar: avatar ? `http://localhost:8080/static/user/${avatar}` : require('../../../assets/images/default.jpg')
      }
      this.setState({
        selectUser: user,
        members: []
      });
    }

    clearSelectUser () {
      this.setState({
        selectUser: {
          id: '',
          nickname: '',
          avatar: '',
        } 
      })
    }

    // 添加新对话
    async addBubble () {
      let userStore = this.props.userStore,
          user = this.state.selectUser;
      await Qlquery.sendMessage({
        userId: userStore.user.userId,
        token: userStore.user.token,
        objectId: user.id,
        content: this.state.selectText
      })
      .then(({data}) => {
        let response = data.data.data;
        if (response.code === 0) {
          // 发送成功
          this.refs.addBubble.toggle();
          this.setState({
            selectText: ''
          });
          this.props.history.push(`/info/${user.id}`)
        } else {
          this.showTooltip(response.msg, "发送消息失败:(")
        }
      })
    }

    generateInfoAdd () {
      if (this.state.selectUser.id) {
        return (
          <div className="aim-user">
            <span>TO：{this.state.selectUser.nickname}({this.state.selectUser.id})</span>
            <span><FontAwesomeIcon icon="window-close" onClick={this.clearSelectUser.bind(this)}/></span>
          </div>
        )
      } else {
        return (
          <input type="text"
            placeholder="搜索ID" 
            className="input"
            onChange={this.searchMembers.bind(this)}/>
        )
      }
    }

    generateBubble () {
      if (!this.state.infos || !this.state.infos.length) {
        return;
      }
      return (
        <div className="infos flex-1">
          <div className="chat-header">
            <p className="text">{this.state.user.nickname}</p>
            <p className="des">{this.state.user.des || "暂无个人简介"}</p>
          </div>
          <div className="chat-body" ref="chatbox">
          {
            this.state.infos.map((item) => {
              if (item.from.id === this.state.user.id) {
                return (
                  <div className="chat-one-item" 
                                  key={item.id}>
                    <div className="item-avatar">
                    <img src={item.avatar ? `http://localhost:8080/static/user/${item.from.avatar}` : require('../../../assets/images/default.jpg')}
                          alt={item.from.nickname}/>
                    </div>
                    <div className="item-main">
                      <div className="buble">
                        {item.content}
                        {this.generateExtraContent(item.id,item.type, item.detail)}
                      </div>
                      <p className="date">{item.date}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="chat-one-item mine"
                                key={item.id}>
                    <div className="item-avatar">
                    <img src={item.from.avatar ? `http://localhost:8080/static/user/${item.from.avatar}` : require('../../../assets/images/default.jpg')}
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
            <textarea cols="3" value={this.state.sendText} onChange={(e) => {
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
      )
    }


    generateList () {
      if (!this.state.users || !this.state.users.length) {
        return (
          <div className="info-user-list-none">
            <p>暂无联系人</p>
          </div>
        )
      }
      return (
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
                    src={item.from.avatar ? `http://localhost:8080/static/user/${item.from.avatar}` : require('../../../assets/images/default.jpg')}
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
      )
    }

    render () {
        return (
          <div className="page overflow">
                <Loading ref="loading"/>
                <Tooltip ref="tooltip" text={this.state.tipText}/>
                <Sidebar />
                <div className="flex-column flex-1">
                    <Modal title="添加对话" ref="addBubble">
                    <div className="add-infos">
                      <div className="mem-search">
                        {
                          this.generateInfoAdd()
                        }
                        <ul className="ul-add-mem">
                        {
                          this.state.members&&this.state.members.map((item) => {
                            return (
                            <li key={item.id}
                                onClick={this.selectInfoUser.bind(this, item.id, item.nickname, item.avatar)}>
                              <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` : require('../../../assets/images/default.jpg')}
                                   title={item.nickname}
                                   alt=""/>
                              <p>{item.nickname}({item.id})</p>
                            </li>  
                            )
                          })
                        }
                        </ul>                        
                      </div>
                        <textarea cols="3"
                                  placeholder="输入要发送的消息..."
                                  value={this.state.selectText}
                                  onChange={(e) => {
                                this.setState({
                                  selectText: e.target.value
                                })
                              }}></textarea>
                        <div className="btns">
                          <button className="radius-btn input-btn"
                                  onClick={this.addBubble.bind(this)}>发送对话</button>  
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
                            {
                              this.generateList()
                            }
                        </div>  
                        {
                          this.generateBubble()
                        }
                    </div>   
                </div>
            </div>
        );
    }
}

export default Page;