import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';

import Modal from '../../../components/modal';
import DropDown from '../../../components/dropdown'; 
import Switch from '../../../components/switch'; 

import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

import Qlquery from './graphql';

import axios from 'axios';
import { inject, observer } from 'mobx-react';
let newsList = [
  {
    id: 3,
    title: '是否要做Code Review？与BAT资深架构...',
    link: '/',
    author: {
      name: '小郑哥',
      avatar: require('../../../assets/images/avatar3.jpg'),
      id: 'rgrg'
    },
    date: '1天前',
    type: 2
  },
  {
    id: 4,
    title: '《深入react技术栈》之样式处理',
    link: '/',
    author: {
      name: '歌非',
      avatar: require('../../../assets/images/avatar6.jpg'),
      id: 'trrtr'
    },
    date: '1天前',
    des: 'css模块化的方案:CSS Module CSS Module样式默认局部,要使用全局样式就加入:...《深入React技术栈》笔记 一、初入React世界 1.2 JSX语法 class 属性修改为...',
    type: 1
  },
  {
    id: 6,
    title: '搜索和在线阅读 Github 代码的插件推荐',
    link: '/',
    author: {
      name: 'sedes',
      avatar: require('../../../assets/images/avatar4.jpg'),
      id: 'sedes'
    },
    date: '1天前',
    isCollected: false,
    type: 2
  },
  {
    id: 7,
    title: '最让程序员自豪的事情是什么？',
    link: '/',
    author: {
      name: '此人已失踪',
      avatar: require('../../../assets/images/avatar5.jpg'),
      id: 'sedes'
    },
    date: '1天前',
    isCollected: false,
    type: 1
  },
  {
    id: 8,
    title: '搜索和在线阅读 Github 代码的插件推荐',
    link: '/',
    author: {
      name: 'sedes',
      avatar: require('../../../assets/images/avatar6.jpg'),
      id: 'sedes'
    },
    date: '1天前',
    isCollected: false,
    type: 1
  }
]

let groupList = [{
  id: '1232',
  name: '野原家',
  count: 3,
  avatar: require('../../../assets/images/avatar5.jpg'),
  news: []
}, {
  id: '1233',
  name: '向日葵班',
  count: 14,
  avatar: require('../../../assets/images/avatar6.jpg'),
  news: []
}];

let groupMember = [{
  id: 'hdbdm', 
  name: '无脸男',
  avatar: require('../../../assets/images/avatar2.jpg')
}, {
  id: 'hdbd3m',
  name: '大神', 
  avatar: require('../../../assets/images/avatar4.jpg')
},
{
  id: 'hdb2dm', 
  name: '山东省',
  avatar: require('../../../assets/images/avatar3.jpg')
},
{
  id: 'hdb4dm', 
  name: '圣斗士',
  avatar: require('../../../assets/images/avatar.jpg')
}]

@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          statistics: '',
          groupList: [],
          group: {
            name: '',
            des: '',
            id: '',
            avatar: '',
            members: []
          },
          tId: '',
          tName: '',
          tDes: '',
          tAvatar: '',
          tPublic: false,
          tIdTip: '',
          tNameTip: '',
          searchText: '',
          searchList: [],
          isAuth: 0 
        }
        this.getNewsList = this.getNewsList.bind(this);
    }

    async componentWillMount() {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
      }
      document.title="团队 - 墨鱼笔记";
      let userStore = this.props.userStore;
      let params = this.props.match.params;
      await userStore.getGroup();

      if(userStore.groupList.length) {
        let group;
        if (!(params && params.id)) {
          group =  {
            name: userStore.groupList[0].nickname,
            des: userStore.groupList[0].des,
            id: userStore.groupList[0].id,
            avatar: userStore.groupList[0].avatar || null
          };
        } else {
          // 如果域名有团队
          userStore.groupList.forEach((item) => {
            if (item.id === params.id) {
              group = item;
            }
          })
          
          // 如果group不存在，要请求group的信息
          if (!group) {
           await Qlquery.getGroupEasy(params)
           .then(({data}) => {
             let res = data.data.data;
             if(res.id) {
               group = {
                 id: res.id,
                 name: res.nickname,
                 avatar: `http://localhost:8080/static/group/${res.avatar}`
               }
             }
           })
           .catch((err) => {
             console.log(err);
           })
          }
        }

        let groupList = userStore.groupList.map((item) => {
          return {
            id: item.id,
            text: item.nickname,
            avatar: item.avatar || require('../../../assets/images/default_g.jpg'),
            link: `/group/${item.id}`
          }
        })
        // 获取团队成员
        await Qlquery.getMembers({
          groupId: group.id
        })
        .then(({data}) => {
          let res = data.data.data;
          group.members = res || [];
        })
       
        this.setState({
          groupList: groupList,
          group: {
            name: group.name,
            des: group.des,
            id: group.id,
            avatar: group.avatar || null,
            members: group.members
          }
        })

      }
    }
    
    /**
     * 获取团队首页信息
     */
    fetchGroupData () {
      // 获取团队成员、团队数据、团队动态
    }
    
    
    /** 
     * 添加成员面板
    */
    toggleAddMem () {
      this.refs.addMem.toggle();
    }

    /** 
     * 管理团队面板
    */
   toggleSetting () {
     let group = this.state.group;
     this.setState({
      tId: group.id,
      tName: group.name,
      tDes: group.des,
      tAvatar: group.avatar,
      tPublic: group.public,
      tIdTip: '',
      tNameTip: '',
     })
     this.refs.setting.toggle();
   }
   
   /**
    * 团队数据统计面板
    */
   toggleStatistics () {
     this.refs.statistics.toggle();
   }

   /**
    * 搜索用户
    * @param {*} type 
    */
   async searchUser () {
     let user = this.props.userStore.user;
     await Qlquery.searchUsers({
       token: user.token,
       userId: user.userId,
       search: this.state.searchText
     })
     .then(({data}) => {
       let res = data.data.data;
       this.setState({
         searchList: res
       })
     })
   }

  getNewsIcon (type) {
    switch(type) {
      case 1: return (
        <span className="icon pen"><FontAwesomeIcon icon="pen" /></span>
      );break;
      case 2: return (
        <span className="icon camera"><FontAwesomeIcon icon="camera" /></span>
      )
    }
  }

  /**
   * 获取动态列表
   *  */
  getNewsList (item) {
    return (
    <div className="item-news" key={item.id}>
      <div className="avatar">                              
        <img src={item.author.avatar}/>
      </div>
      <div className="detail">
        <div className="header">
          <p className="date">{item.date}</p>
          <p className="author"><Link to='/' className="link">{item.author.name}</Link></p>
          <p className="type">
            {this.getNewsIcon(item.type)}
            创建了一篇新的文章<Link to={item.link}>{item.title}</Link>   
          </p>
        </div>
        <div className="body">
          {item.des}
        </div>
      </div>
    </div>
    );
  }

  /**
   * 生成团队操作按钮
   */
  generateOptions () {
    // 
    if (this.state.isAuth === 0) {
      return (
        <ul className="ul-list-link">
          <li><Link to={`/library/group/${this.state.group}`}><FontAwesomeIcon icon="book" />文库</Link></li>
          <li><Link to={`/gallery/group/${this.state.group}`}><FontAwesomeIcon icon="image" />图库</Link></li>
          <li><span onClick={this.toggleStatistics.bind(this)}><FontAwesomeIcon icon="users" />成员</span></li>
          <li><span onClick={this.toggleSetting.bind(this)}><FontAwesomeIcon icon="cogs" />设置</span></li>
        </ul>
      )
    } else {
      return (
        <ul className="ul-list-link">
          <li><Link to={`/library/group/${this.state.group}`}><FontAwesomeIcon icon="book" />文库</Link></li>
          <li><Link to={`/gallery/group/${this.state.group}`}><FontAwesomeIcon icon="image" />图库</Link></li>
          <li><span onClick={this.toggleStatistics.bind(this)}><FontAwesomeIcon icon="users" />成员</span></li>
        </ul> 
      )
    }
  }

  /**
   * 生成团队主模块
   */
  generateGroupMain () {
    if (this.state.groupList.length) {
      return (
      <div className="flex-row">
         <div className="group-box right flex-column">
            <div className="us-about">
              <div className="cover">
                <img src={ this.state.group.avatar || require('../../../assets/images/default_g.jpg')}/>
              </div>
              <p className="title">{this.state.group.name}</p>
              <p className="des">{this.state.group.des || '暂无简介'}</p>
              <div className="us-list">
                <ul className="us-people">
                  {
                    this.state.group.members&&this.state.group.members.map((item) => (
                      <li key={item.id}>
                        <img src={item.avatar} alt={item.name}/></li>
                    ))
                  }
                  <li><span className="btn-add" onClick={this.toggleAddMem.bind(this)}>+</span></li>
                </ul>
              </div>
             </div>

            <div className="group-links">
              <h1 className="normal-title">操作通道</h1>
              {
                this.generateOptions()
              }   
            </div> `  
        </div>

        <div className="flex-column group-main">
          <div className="group-statistics">
                <div className="section-title">
                  <h1 className="text">数据统计</h1>
                  <Link to="/"><FontAwesomeIcon icon="ellipsis-h" /></Link> 
                </div>
                <div className="flex-row">
                  <div className="group-statist-detail">
                    <div className="item-statist">
                      <p className="data">123</p>
                      <p className="name">文章</p>
                    </div>
                    <div className="item-statist">
                      <p className="data">26</p>
                      <p className="name">文章</p>
                    </div>
                    <div className="item-statist">
                      <p className="data">17</p>
                      <p className="name">评论</p>
                    </div>
                    <div className="item-statist">
                      <p className="data">1454</p>
                      <p className="name">浏览</p>
                    </div>
                  </div>
                  <div className="statist-graph" id="statist-graph"></div>
                </div>
            </div>
            <div className="news">
              <div className="section-title">
                <h1 className="text">团队动态</h1>
                <Link to="/"><FontAwesomeIcon icon="ellipsis-h" /></Link> 
              </div>
              {
                newsList.map((item, index) => {
                  return this.getNewsList(item);
                })
              }
            </div>
          </div>
      </div>
      )
    } else {
      return (
        <div className="group-no-tip">
          <p className="title">你还没有加入任何团队哦！</p>
          <p className="des">你可以创建新团队，也可以进行搜索申请加入团队</p>
        </div>
      )
    }
  }
  
  /**
   * 生成切换栏
   */
  generateSwitch () {
    if (this.state.groupList.length) {
      return (
        <div className="group-switch">
          <DropDown data={this.state.groupList}>
              <img src={this.state.group.avatar || require('../../../assets/images/default_g.jpg')} className="link-img"/>
              {this.state.group.name}
              <FontAwesomeIcon icon="caret-down" className="link-svg"/>
          </DropDown>
        </div>
      )
    }
  }
  
  componentDidMount () {
    // 基于准备好的dom，初始化echarts实例
    //var myChart = echarts.init(document.getElementById('statist-graph'));
    // 绘制图表
    // myChart.setOption({});
  }

  toggleCreateGroup () {
    this.setState({
      tId: '',
      tName: '',
      tDes: '',
      tAvatar: '',
      tPublic: false,
      tIdTip: '',
      tNameTip: ''
    })
    this.refs.createGroup.toggle();

  }

   /**
    * 创建一个团队
    */
   createGroup (args) {
     const query = `
     mutation {
      data:
      groupSave(
          token: "${this.props.userStore.user.token}",
          userId: "${this.props.userStore.user.userId}",
          groupId: "${this.state.tId}",
          des: "${this.state.tDes}",
          name: "${this.state.tName}",
          auth: ${this.state.tPublic ? 1 : 0},
          avatar: "${this.state.tAvatar}"
      )
     }
    `
     axios({
        url: '/graphql',
        method: 'post',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodeURIComponent("query")+"="+encodeURIComponent(query)
     })
     .then(({data})=> {
       let res = data.data.data;
       if (res === 1) {
         // 创建成功
         let id = this.state.tId;
         this.toggleCreateGroup();
         this.props.history.push(`/group/${id}`)
       } else {

       }
     })
   }

   checkGroupId () {
     const query = `
     query {
       data:
       isGroupExist(
         id: "${this.state.tId}"
       )
     }
     `
     axios.post('/graphql', {query})
     .then(({data}) => {
       let res = data.data.data;
       if (res) {
         // 团队名存在
         this.setState({
           tIdTip: '团队域名已存在'
         })
       } else {
         // 团队名不存在
         this.setState({
           tIdTip: ''
         })
       }
     })
   }

    render () {
        return (
          <div className="page">
                <Sidebar />
                <div className="flex-row flex-1 overflow">
                    <Modal title="添加成员" ref="addMem">
                      <div className="add-mem">
                        <input type="text"
                               placeholder="搜索ID" 
                               className="input"
                               onChange={(e) => {
                                 this.setState({
                                   searchText: e.target.value.trim()
                                 })
                               }}/>
                        <ul className="ul-add-mem">
                        {
                          this.state.group.searchList&&this.state.group.searchList.map((item) => {
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
                          <button className="radius-btn input-btn">发送邀请</button>  
                        </div>
                      </div>
                    </Modal>

                    <Modal title="团队成员" ref="statistics">
                      <div className="member-manage">
                        <table className="member-table">
                          <tbody>
                            <tr>
                              <th>成员</th>
                              <th>加入日期</th>
                              <th>权限</th>
                              <th></th>
                            </tr>
                            <tr>
                              <td className="member">
                                <div className="flex-row flex-align">
                                  <img src={require('../../../assets/images/avatar2.jpg')}
                                      className="avatar"
                                      alt=""/>
                                  <div className="info">
                                    <p className="text">测试</p>
                                    <p className="des">test111</p>
                                  </div>                              
                                </div>
                              </td>
                              <td>
                                <p>2019-03-11</p>
                              </td>
                              <td><p>管理员</p></td> 
                              <td className="icon">
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="flex-row flex-align">
                                  <img src={require('../../../assets/images/avatar2.jpg')}
                                      className="avatar"
                                      alt=""/>
                                  <div className="info">
                                    <p className="text">测试</p>
                                    <p className="des">test111</p>
                                  </div>                              
                                </div>
                              </td>
                              <td>
                                <p>2019-03-11</p>
                              </td>
                              <td>
                                <select className="mck-select">
                                  <option>管理员</option>
                                  <option>一般用户</option>
                                </select>
                              </td> 
                              <td className="icon">
                                <FontAwesomeIcon icon={["far", "trash-alt"]} />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <button className="input-btn radius-btn">确认修改</button>
                      </div>
                    </Modal>

                    <Modal title="创建小组" ref="createGroup">
                      <div className="settings-detail">
                        <div className="flex-row">
                          <div className="flex-column input-side">
                            <div className="input-group">
                              <label className="input-label" 
                                     >小组域名</label>
                              <input className="input-text"
                                     type="text" 
                                     placeholder="请输入域名"
                                     onChange={(e) => {
                                       this.setState({
                                         tId: e.target.value
                                       })
                                     }}
                                     onBlur={this.checkGroupId.bind(this)}/>
                              <span className="input-mark">{this.state.tIdTip || "必填项"}</span>
                            </div>

                            <div className="input-group">
                              <label className="input-label">小组名称</label>
                              <input className="input-text" 
                                     type="text" 
                                     placeholder="请输入昵称"
                                     onChange={(e) => {
                                      this.setState({
                                        tName: e.target.value
                                      })
                                    }}
                                    onBlur={()=>{
                                      if (this.state.tName && this.state.tName.length > 12) {
                                        this.setState({
                                          tNameTip: '团队名称超过了12个字符'
                                        })
                                      }
                                    }}/>
                              <span className="input-mark">{this.state.tNameTip || "必填项，12个字符以内"}</span>
                            </div>

                            <div className="input-group">
                              <label className="input-label">小组简介</label>
                              <textarea className="input-area" 
                                        type="text" 
                                        placeholder="介绍一下你的小组吧！50字以内"
                                        onChange={(e) => {
                                          this.setState({
                                            tDes: e.target.value
                                          })
                                        }}/>
                              <span className="input-mark">非必填项</span>
                            </div>

                            <div className="input-group mini-group">
                              <div>
                                <label className="input-label">小组是否私密</label>
                                <span className="input-mark">私密小组的图文库只有成员能浏览</span>
                              </div>
                              <Switch 
                                isChecked="this.state.temp.public"
                                toggle={() => {
                                  this.setState({
                                    temp: {
                                      public: !this.state.temp.public
                                    }
                                  })
                                }}/>
                            </div> 
                          </div>

                          <div className="input-group">
                            <label className="input-label">小组头像</label>
                            <div className="two-side">
                              <img src={this.state.tAvatar || require('../../../assets/images/default_g.jpg')} className="input-img"/>
                              <div className="input-file-box">
                                  <input className="file-input" 
                                         type="file"
                                         accept="image/jpeg,image/x-png"
                                         onChange={(e) => {
                                          let file = e.target.files[0],
                                              reader = new FileReader();
                                          reader.readAsDataURL(file);
                                          reader.onload = (e) => {
                                            this.setState({
                                              tAvatar: e.target.result
                                            })
                                          } 
                                         }}/>
                                  <button className="input-btn file-btn radius-btn"><FontAwesomeIcon icon="upload"/>上传头像</button>
                              </div>
                            </div>
                           <span className="input-mark">非必填项</span>
                          </div>
                        </div>

                        <div className="input-group">
                          <button className="input-btn radius-btn"
                                  onClick={this.createGroup.bind(this)}>确认</button>
                        </div>
                      </div>
                    </Modal>

                    <Modal title="团队设置" ref="setting">
                    <div className="settings-detail">
                        <div className="flex-row">
                          <div className="flex-column input-side">
                            <div className="input-static-group">
                              <label className="input-label">小组域名</label>
                              <div className="input-static">
                                <p className="input-pure-text">{this.state.group.id}</p>
                              </div>
                            </div>
                            <div className="input-group">
                              <label className="input-label">小组名称</label>
                              <input className="input-text" 
                                     type="text" 
                                     placeholder="请输入昵称"
                                     onChange={(e) => {
                                      this.setState({
                                        tName: e.target.value
                                      })
                                    }}
                                    onBlur={()=>{
                                      if (this.state.tName && this.state.tName.length > 12) {
                                        this.setState({
                                          tNameTip: '团队名称超过了12个字符'
                                        })
                                      }
                                    }}/>
                              <span className="input-mark">必填项</span>
                            </div>

                            <div className="input-group">
                              <label className="input-label">小组简介</label>
                              <textarea className="input-area" 
                                        type="text" 
                                        placeholder="介绍一下你的小组吧！50字以内"
                                        onChange={(e) => {
                                          this.setState({
                                            tDes: e.target.value
                                          })
                                        }}/>
                              <span className="input-mark">非必填项</span>
                            </div>

                            <div className="input-group mini-group">
                              <div>
                                <label className="input-label">小组是否私密</label>
                                <span className="input-mark">私密小组的图文库只有成员能浏览</span>
                              </div>
                              <Switch 
                                isChecked="this.state.temp.public"
                                toggle={() => {
                                  this.setState({
                                    temp: {
                                      public: !this.state.temp.public
                                    }
                                  })
                                }}/>
                            </div> 

                            <div className="input-group">
                              <button className="input-btn radius-btn">确认</button>
                            </div>
                          </div>
                         
                         <div className="flex-column">
                            <div className="input-group">
                              <label className="input-label">小组头像</label>
                              <div className="two-side">
                                <img src={require('../../../assets/images/default_g.jpg')} className="input-img"/>
                                <div className="input-file-box">
                                  <input className="file-input" 
                                         type="file"
                                         accept="image/jpeg,image/x-png"
                                         onChange={(e) => {
                                          let file = e.target.files[0],
                                              reader = new FileReader();
                                          reader.readAsDataURL(file);
                                          reader.onload = (e) => {
                                            this.setState({
                                              tAvatar: e.target.result
                                            })
                                          } 
                                         }}/>
                                  <button className="input-btn file-btn radius-btn"><FontAwesomeIcon icon="upload"/>上传头像</button>
                                </div>
                              </div>
                              <span className="input-mark">非必填项</span>
                            </div>
                            
                            <div className="input-group">
                              <label className="input-label">其他选项</label>
                              <button className="normal-btn radius-btn">解散小组</button>
                              <span className="input-mark">操作不可逆，小组文库图库都不会保留</span>
                            </div>
                        </div>
                        </div>
                      </div>
                    </Modal>
                  
                  <div className="flex-column  flex-scroll-y">
                    <Header />
                    <div className="group-header">
                      {
                        this.generateSwitch()
                      }
                      <div className="group-add" onClick={this.toggleCreateGroup.bind(this)}>
                        创建团队
                      </div>                  
                    </div>
                     {
                       this.generateGroupMain()
                     }
                  </div>
                </div>
            </div>
        );
    }
}

export default Page;