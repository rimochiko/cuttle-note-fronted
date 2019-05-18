import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';

import Modal from '../../../components/modal';
import DropDown from '../../../components/dropdown'; 
import Switch from '../../../components/switch'; 
import Loading from '../../../components/loading';
import Tooltip from '../../../components/tooltip';

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

const FILE_LIKE = 2,
      FILE_COLLECT = 3,
      FILE_CREATE = 5,
      FILE_COMMENT = 8;

// 团队动作相关
const GROUP_JOIN = 25;

// 个人操作相关
const USER_FOLLOW = 44;
const defaultStatistic = {
  likeNum: 0,
  textNum: 0,
  viewNum: 0,
  imgNum: 0,
  charts: [{"name":"记录次数",
  "type":"line",
  "smooth":true,
  "stack":"总量",
  "areaStyle":{"color":"#d3d3e7"},
  "lineStyle":{"color":"#d3d3e7"},
  "data":[0,0,0,0,0,0,0]}]  
}

@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          statistics: defaultStatistic,
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
          tDesTip: '',
          tAvatarTip: '',
          searchList: [],
          selectList: [],
          isAuth: 5,
          news: [],
          tipText: '' 
        }
        this.getNewsList = this.getNewsList.bind(this);
        this.judgeSubmitForm = this.judgeSubmitForm.bind(this);
    }

    async fetchGroupData(id) {
      let userStore = this.props.userStore;
      let params = id;

      if(userStore.groupList.length) {
        let group;
        if (!(id)) {
          group =  {
            name: userStore.groupList[0].nickname,
            des: userStore.groupList[0].des,
            id: userStore.groupList[0].id,
            avatar: userStore.groupList[0].avatar || null
          };
        } else {
          // 如果域名有团队
          userStore.groupList.forEach((item) => {
            if (item.id === id) {
              group = item;
            }
          })
          
          // 如果group不存在，要请求group的信息
          if (!group) {
           await Qlquery.getGroupEasy({id})
           .then(({data}) => {
             let res = data.data.data;
             if(res.id) {
               group = {
                 id: res.id,
                 name: res.nickname,
                 avatar: res.avatar ? `http://localhost:8080/static/group/${res.avatar}` : ''
               }
             }
           })
           .catch((err) => {
             console.log(err);
           })
          }
        }

        // 获取团队成员
        await Qlquery.getMembers({
          groupId: group.id
        })
        .then(({data}) => {
          let res = data.data.data;
          group.members = res.member || [];
        })

        for(let i = 0, len = group.members.length; i < len; i++) {
          if (group.members[i].id === userStore.user.userId) {
            this.setState({
              isAuth: group.members[i].role
            })
            break;
          }
        }

        // 获取主页数据
        await Qlquery.getHomeData({
          groupId: group.id,
          token: this.props.userStore.user.token,
          userId: this.props.userStore.user.userId
        })
        .then(({data}) => {
          let news = data.data.news,
              statistics = data.data.statistic;
              statistics.charts =  statistics && statistics.charts && statistics.charts.map(item => JSON.parse(item))
          this.setState({
            news: news.options,
            statistics: statistics
          })
        })
       
        this.setState({
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
    */
   async searchUser (text) {
     let user = this.props.userStore.user;
     if(text === '') {
       this.setState({
         searchList: []
       })
     };

     await Qlquery.searchUsers({
       token: user.token,
       userId: user.userId,
       search: text
     })
     .then(({data}) => {
       let res = data.data.data;
       if(res.code === 1) {
        this.setState({
          searchList: res.users
        })         
       }
     })
     .catch((err) => {
       console.log(err);
     })
   }

  getNewsIcon (type) {
    switch(type) {
      case 0: return (
        <span className="icon pen"><FontAwesomeIcon icon="pen" /></span>
      );
      case 1: return (
        <span className="icon camera"><FontAwesomeIcon icon="camera" /></span>
      )
      default: return '';
    }
  }

    /**
     * 获取动态列表
     *  */
    getNewsList (item) {
      // 根据动态种类
      switch(item.type) {
        case FILE_CREATE:
          return (
            <div className="item-news" key={item.id}>
              <div className="avatar">                              
                <img src={item.user.avatar ? `http://localhost:8080/static/user/${item.user.avatar}` : require('../../../assets/images/default.jpg')} 
                     alt={item.user.id}/>
              </div>
              <div className="detail">
                <div className="header">
                  <p className="date">{item.date}</p>
                  <p className="author"><Link to='/' className="link">{item.user.nickname}</Link></p>
                  <p className="type">
                    {this.getNewsIcon(item.post.type)}
                    {item.post.type === 0 ? "创建了一篇新文章 " : "创建了一张新图画 "}
                    <Link to={item.post.type === 0 ? `/library/${item.post.link}`:`/gallery/${item.post.link}`}>{item.post.title}</Link>   
                  </p>
                </div>
                <div className="body">
                  {item.post.type === 0 ? item.post.content : "" } 
                </div>
              </div>
            </div>
          );
        default: return '';
      }

    }

  /**
   * 生成团队操作按钮
   */
  generateOptions () {
    // 
    if (this.state.isAuth === 0) {
      return (
        <ul className="ul-list-link">
          <li><Link to={`/library/group/${this.state.group.id}`}><FontAwesomeIcon icon="book" />文库</Link></li>
          <li><Link to={`/gallery/group/${this.state.group.id}`}><FontAwesomeIcon icon="image" />图库</Link></li>
          <li><span onClick={this.toggleStatistics.bind(this)}><FontAwesomeIcon icon="users" />成员</span></li>
          <li><span onClick={this.toggleSetting.bind(this)}><FontAwesomeIcon icon="cogs" />设置</span></li>
        </ul>
      )
    } else {
      return (
        <ul className="ul-list-link">
          <li><Link to={`/library/group/${this.state.group.id}`}><FontAwesomeIcon icon="book" />文库</Link></li>
          <li><Link to={`/gallery/group/${this.state.group.id}`}><FontAwesomeIcon icon="image" />图库</Link></li>
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
                <img src={ this.state.group.avatar || require('../../../assets/images/default_g.jpg')}
                     alt={this.state.group.name}/>
              </div>
              <p className="title">{this.state.group.name}</p>
              <p className="des">{this.state.group.des || '暂无简介'}</p>
              <div className="us-list">
                <ul className="us-people">
                  {
                    this.state.group.members&&this.state.group.members.map((item) => (
                      <li key={item.id}>
                        <img src={`http://localhost:8080/static/user/${item.avatar}` ||  require('../../../assets/images/default.jpg')} 
                             alt={item.name}
                             title={item.name}/>
                      </li>
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

        <div className="flex-column group-main flex-1">
          <div className="group-statistics">
                <div className="section-title">
                  <h1 className="text">数据统计</h1>
                  <Link to="/"><FontAwesomeIcon icon="ellipsis-h" /></Link> 
                </div>
                <div className="flex-row">
                  <div className="group-statist-detail">
                    <div className="item-statist">
                      <p className="data">{this.state.statistics.textNum}</p>
                      <p className="name">文章</p>
                    </div>
                    <div className="item-statist">
                      <p className="data">{this.state.statistics.imgNum}</p>
                      <p className="name">图画</p>
                    </div>
                    <div className="item-statist">
                      <p className="data">{this.state.statistics.likeNum}</p>
                      <p className="name">点赞量</p>
                    </div>
                    <div className="item-statist">
                      <p className="data">{this.state.statistics.viewNum}</p>
                      <p className="name">浏览量</p>
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
                this.state.news&&this.state.news.map((item, index) => {
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
              <img src={this.state.group.avatar || require('../../../assets/images/default_g.jpg')} 
                   className="link-img"
                   alt={this.state.group.name}/>
              {this.state.group.name}
              <FontAwesomeIcon icon="caret-down" className="link-svg"/>
          </DropDown>
        </div>
      )
    }
  }
  
  async componentDidMount () {
     // 判断是否有登录
     if (await this.props.userStore.isLogin() === false) {
      this.props.history.push('/login');
      return;
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
        group.members = res.member || [];
      })
      for(let i = 0, len = group.members.length; i < len; i++) {
        if (group.members[i].id === userStore.user.userId) {
          this.setState({
            isAuth: group.members[i].role
          })
          break;
        }
      }

      // 获取首页数据
      await Qlquery.getHomeData({
        groupId: group.id,
        token: this.props.userStore.user.token,
        userId: this.props.userStore.user.userId
      })
      .then(({data}) => {
        let news = data.data.news,
            statistics = data.data.statistic;
            statistics.charts =  statistics && statistics.charts && statistics.charts.map(item => JSON.parse(item))
            this.setState({
          news: news.options,
          statistics: statistics
        })
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
    let  myChart = echarts.init(document.getElementById('statist-graph'));
    // 绘制图表
    myChart.setOption({
      tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:['浏览量','人气量','记录次数']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        backgroundColor: '#f7f7fb'
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : (this.state.statistics && this.state.statistics.dates) || ['','','','','','','']
        }
    ],
    yAxis : [{
            type : 'value'
    }],
    series :(this.state.statistics && this.state.statistics.charts) || defaultStatistic.charts
     });
    this.refs.loading.toggle();
  }
  
  /**
   * 创建新团队
   */
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
    Qlquery.createGroup({
      token: this.props.userStore.user.token,
      userId: this.props.userStore.user.userId,
      tId: this.state.tId,
      tDes: this.state.tDes,
      tName: this.state.tName,
      tPublic: this.state.tPublic,
      tAvatar: this.state.tAvatar
    })
    .then(({data})=> {
       let res = data.data.data;
       if (res === 1) {
         // 创建成功
         let id = this.state.tId;
         this.toggleCreateGroup();
         this.props.history.push(`/group/${id}`)
       } else {
         this.setState({
           tipText: '创建团队失败:('
         });
         this.refs.tooltip.show()
       }
     })
     .catch((err) => {
       console.log(err);
       this.setState({
        tipText: '创建团队失败:('
      });
      this.refs.tooltip.show()
     })
   }
  
   /**
    * 检查团队名是否存在
    */
   checkGroupId () {
    Qlquery.checkGroupId({
      id: this.state.tId
    })
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
     .catch((err) => {
       console.log(err)
     })
   }

   async componentWillUpdate(nextProps) {
    let defaultId = this.state.groupList[0] && this.state.groupList[0].id,
        prevMatch = (this.props.match.params && this.props.match.params.id) || defaultId,
        nextMatch = (nextProps.match.params && nextProps.match.params.id) || defaultId

    if (prevMatch === nextMatch) {
      return;
    }
    this.refs.loading.toggle();
    await this.fetchGroupData(nextMatch);
    this.refs.loading.toggle();
 }

  /**
    * 移除选择
    * @param {*} id 
    */
  removeSelectItem(id) {
    let list = this.state.selectList.slice(0), i, len;
    for(i = 0, len = list.length; i < len; i++) {
      if (list[i].id === id) {
        break;
      }
    }
    if (i < list.length) {
      list.splice(i, 1);
      this.setState({
        selectList: list
      })    
    }
  }
  
  /**
   * 添加选中人
   * @param {*} id 
   * @param {*} nickname 
   * @param {*} avatar 
   */
  addSelectItem(id, nickname, avatar) {
    let list = this.state.selectList.slice(0);
    list.push({
      id: id,
      nickname: nickname,
      avatar: avatar || require('../../../assets/images/default.jpg')
    });
    this.setState({
      selectList: list
    });
  }

  /**
   * 发送邀请
   */
  async sendInvite () {
    Qlquery.sendInvite({
      token: this.props.userStore.user.token,
      userId: this.props.userStore.user.userId,
      groupId: this.state.group.id,
      users: this.state.selectList
    })
    .then(({data})=> {
      let res = data.data.data;
      if(res === 1) {
        this.setState({
          tipText: '邀请信息已发送'
        });
        this.refs.addMem.toggle();
        this.refs.tooltip.show();
      } else {
        this.setState({
          tipText: '邀请发送失败'
        });
        this.refs.addMem.toggle();
        this.refs.tooltip.show();
      }
    })
    .catch((err) => {
      console.log(err);
      this.setState({
        tipText: '邀请发送失败'
      });
      this.refs.tooltip.show();
    })
  }

  async cancelAdmin (userId) {
    await Qlquery.changeUserRole({
      token: this.props.userStore.user.token,
      userId: this.props.userStore.user.userId,
      groupId: this.state.group.id,
      objectId: userId,
      isAdmin: false
    })
    .then(({data}) => {
      let res = data.data.data;
      if(res === 1) {
        this.setState({
          tipText: '取消管理成功'
        });
      } else {
        this.setState({
          tipText: '取消管理失败'
        });
      }
      this.refs.tooltip.show();
    })
    .catch((err) => {
      console.log(err);
      this.setState({
        tipText: '取消管理失败'
      });      
    })
  }
  
  async setAdmin (userId) {
    await Qlquery.changeUserRole({
      token: this.props.userStore.user.token,
      userId: this.props.userStore.user.userId,
      groupId: this.state.group.id,
      objectId: userId,
      isAdmin: true
    })
    .then(({data}) => {
      let res = data.data.data;
      if(res === 1) {
        this.setState({
          tipText: '设置管理成功'
        });
        this.refs.tooltip.show();
      }
    })
  }

  async deleteUser (userId) {
    await Qlquery.exitGroup({
      token: this.props.userStore.user.token,
      userId: this.props.userStore.user.userId,
      groupId: this.state.group.id,
      objectId: userId
    })
    .then(({data}) => {
      let res = data.data.data;
      if(res === 1) {
        this.setState({
          tipText: '移除成员成功'
        });
      } else {
        this.setState({
          tipText: '移除成员失败'
        });
      }
      this.refs.tooltip.show();
    })
    .catch((err) => {
      this.setState({
        tipText: '移除成员失败'
      });
      this.refs.tooltip.show();     
        this.refs.tooltip.show();
      this.refs.tooltip.show();     
    })
  }

  generateMemberDeleteBtn (roleId, userId) {
    if (this.state.isAuth === 6) {
      // 创始人不可以移除自己
      if(userId === this.props.userStore.user.userId) {
        return '';
      }
      return (
        <FontAwesomeIcon icon={["far", "trash-alt"]}
                         onClick={this.deleteUser.bind(this, userId)}/>
      );
    }

    if (userId === this.props.userStore.user.userId) {
      return (
        <FontAwesomeIcon icon={["far", "trash-alt"]}
                         onClick={this.deleteUser.bind(this, userId)}/>
      );
    }
    return '';
  }

  generateMemberRoleBtn (roleId, userId) {
    if(this.state.isAuth !== 6) {
      return;
    }

    if (roleId === 4) {
      return (
        <button className="radius-btn input-btn" 
                onClick={this.cancelAdmin.bind(this, userId)}>取消管理员</button>
      )
    } else if(roleId === 5) {
      return (
        <button className="radius-btn input-btn"
                onClick={this.setAdmin.bind(this, userId)}>设置管理员</button>
      )
    }
  }

  generateGroupAuth (roleId) {
    if(roleId === 5) {
      return "普通成员"
    }
    if(roleId === 6) {
      return "组长"
    }
    if(roleId === 4) {
      return "副组长"
    }
  }

  judgeSubmitForm (type) {
    if (type === 0) {
        // 如果是创建团队
        if (!this.state.tId || !this.state.tName) {
          return false;
        }
        if (this.state.tIdTip || 
            this.state.tNameTip || 
            this.state.tDesTip || 
            this.state.tAvatarTip) {
            return false;
        }
        return true;
    } else {
        // 如果是更新团队
        if (!this.state.tName) {
          return false;
        }
        if (this.state.tIdTip || 
            this.state.tNameTip || 
            this.state.tDesTip || 
            this.state.tAvatarTip) {
            return false;
        }
        return true;   
    }
    return false;
  }

  judgeTempAvatar (e) {
    if (!e.target.files) {
      return;
    }
    let file = e.target.files[0],
    reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      let tag="base64,",
          base64 = e.target.result,
          baseStr = base64.substring(base64.indexOf(tag) + tag.length);
      let eqTagIndex=baseStr.indexOf("=");
          baseStr=eqTagIndex!=-1?baseStr.substring(0,eqTagIndex):baseStr;
      let strLen=baseStr.length;
      let fileSize=(strLen-(strLen/8)*2)/1024;
      if(fileSize >= 64) {
        this.setState({
          tAvatarTip: '图片大小不能超过64kb'
        })
        return;
      }
      this.setState({
        tAvatar: e.target.result,
        tAvatarTip: ''
      })
    }
  }

  render () {
        return (
          <div className="page">
                <Sidebar />
                <div className="flex-row flex-1 overflow">
                    <Loading ref="loading"/>
                    <Tooltip text={this.state.tipText} ref="tooltip"/>
                    <Modal title="添加成员" ref="addMem">
                      <div className="add-mem">
                        <input type="text"
                               placeholder="搜索ID" 
                               className="input"
                               onChange={(e) => {
                                 let text = e.target.value.trim();
                                 if (text) {
                                  this.searchUser(text);                                   
                                 }
                               }}/>
                        <ul className="ul-add-mem">
                        {
                          this.state.searchList&&this.state.searchList.map((item) => {
                            return (
                            <li key={item.id}
                                onClick={
                                  this.addSelectItem.bind(
                                    this, 
                                    item.id,
                                    item.nickname,
                                    item.avatar)}>
                              <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` : require('../../../assets/images/default.jpg')} 
                                   alt={item.id}/>
                              <p>{item.nickname}({item.id})</p>
                            </li>
                            )
                          })
                        }
                        </ul>
                        <p className="tip">已选择：</p>
                        <ul className="select-list">
                        {
                          this.state.selectList&&this.state.selectList.map((item) => {
                            return (
                              <li key={item.id}>
                                <p><img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` : require('../../../assets/images/default.jpg')} 
                                        alt={item.id}/>{item.nickname}</p>
                                <span onClick={this.removeSelectItem.bind(this, item.id)}>
                                    <FontAwesomeIcon icon="times"/>
                                </span>
                              </li>                              
                            )
                          }) 
                        }

                        </ul>
                        <div className="btns">
                          <button className="radius-btn input-btn"
                                  onClick={this.sendInvite.bind(this)}>发送邀请</button>  
                        </div>
                      </div>
                    </Modal>

                    <Modal title="团队成员" ref="statistics">
                      <div className="member-manage">
                        <table className="member-table">
                          <tbody>
                            <tr>
                              <th>成员</th>
                              <th>权限</th>
                              <th></th>
                            </tr>
                            {
                              this.state.group.members && this.state.group.members.map((item) => {
                                  return (
                                    <tr key={item.id}> 
                                      <td>
                                      <div className="flex-row flex-align">
                                        <img src={`http://localhost:8080/static/user/${item.avatar}` || require('../../../assets/images/default.jpg')}
                                            className="avatar"
                                            alt={item.id}/>
                                        <div className="info">
                                          <p className="text">{item.nickname}</p>
                                          <p className="des">{item.id}</p>
                                        </div>                              
                                      </div>
                                      </td>
                                      <td>
                                        <p>{this.generateGroupAuth(item.role)}</p>
                                      </td> 
                                      <td className="icon">
                                        {this.generateMemberDeleteBtn(item.role, item.id)}
                                        {this.generateMemberRoleBtn(item.role, item.id)}
                                      </td>
                                    </tr>
                                  )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    </Modal>

                    <Modal title="创建小组" ref="createGroup">
                      <div className="settings-detail">
                        <div className="flex-row">
                          <div className="flex-column input-side">
                            <div className="input-group">
                              <label className="input-label" 
                                     >小组ID</label>
                              <input className="input-text"
                                     type="text" 
                                     placeholder="请输入域名"
                                     value={this.state.tId}
                                     onChange={(e) => {
                                       this.setState({
                                         tId: e.target.value
                                       })
                                     }}
                                     onBlur={()=> {
                                       if(!this.state.tId) {
                                         this.setState({
                                           tIdTip: '团队ID不能为空'
                                         })
                                         return;
                                       }
                                       if(!this.state.Id.match(/^(\w|_){1,10}$/)) {
                                         this.setState({
                                           tIdTip: '团队ID只能包含字母数字和下划线'
                                         })
                                         return;
                                       }
                                      this.checkGroupId.bind(this)
                                      this.setState({
                                        tIdTip: ''
                                      })
                                     }}/>
                              <span className="input-mark">{this.state.tIdTip || "必填项"}</span>
                            </div>

                            <div className="input-group">
                              <label className="input-label">小组名称</label>
                              <input className="input-text" 
                                     type="text" 
                                     placeholder="请输入昵称"
                                     value={this.state.tName}
                                     onChange={(e) => {
                                      this.setState({
                                        tName: e.target.value
                                      })
                                    }}
                                    onBlur={()=>{
                                      if (!this.state.tName) {
                                        this.setState({
                                          tNameTip: '团队名称不能为空'
                                        })
                                        return;
                                      }
                                      if (this.state.tName && this.state.tName.length > 12) {
                                        this.setState({
                                          tNameTip: '团队名称超过了12个字符'
                                        })
                                      }
                                      this.setState({
                                        tNameTip: ''
                                      })
                                    }}/>
                              <span className="input-mark">{this.state.tNameTip || "必填项，12个字符以内"}</span>
                            </div>

                            <div className="input-group">
                              <label className="input-label">小组简介</label>
                              <textarea className="input-area" 
                                        type="text" 
                                        placeholder="介绍一下你的小组吧！50字以内"
                                        value={this.state.tDes}
                                        onChange={(e) => {
                                          this.setState({
                                            tDes: e.target.value
                                          })}}
                                        onBlur={()=>{
                                          if (this.state.tDes && this.state.tName.length > 50) {
                                            this.setState({
                                              tDesTip: '团队简介超过了50个字符'
                                            })
                                          }
                                          this.setState({
                                            tDesTip: ''
                                          })
                                        }}/>
                              <span className="input-mark">{this.state.tDesTip || "非必填项"}</span>
                            </div>

                            <div className="input-group mini-group">
                              <div>
                                <label className="input-label">小组是否私密</label>
                                <span className="input-mark">私密小组的图文库只有成员能浏览</span>
                              </div>
                              <Switch 
                                isChecked={this.state.tPublic}
                                toggle={() => {
                                  this.setState({
                                    temp: {
                                      public: !this.state.tPublic
                                    }
                                  })
                                }}/>
                            </div> 
                          </div>

                          <div className="input-group">
                            <label className="input-label">小组头像</label>
                            <div className="two-side">
                              <img src={this.state.tAvatar || require('../../../assets/images/default_g.jpg')} 
                                   className="input-img"
                                   alt=""/>
                              <div className="input-file-box">
                                  <input className="file-input" 
                                         type="file"
                                         accept="image/jpeg,image/x-png"
                                         onChange={this.judgeTempAvatar.bind(this)}/>
                                  <button className="input-btn file-btn radius-btn"><FontAwesomeIcon icon="upload"/>上传头像</button>
                              </div>
                            </div>
                           <span className="input-mark">{this.state.tAvatarTip || "非必填项"}</span>
                          </div>
                        </div>

                        <div className="input-group">
                          <button className="input-btn radius-btn"
                                  onClick={this.createGroup.bind(this)}
                                  disabled={!this.judgeSubmitForm(0)}>确认</button>
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
                                     value={this.state.tName}
                                      onChange={(e) => {
                                        this.setState({
                                          tName: e.target.value
                                        })
                                      }}
                                      onBlur={()=>{
                                        if (!this.state.tName) {
                                          this.setState({
                                            tNameTip: '团队名称不能为空'
                                          })
                                          return;
                                        }
                                        if (this.state.tName && this.state.tName.length > 12) {
                                          this.setState({
                                            tNameTip: '团队名称超过了12个字符'
                                          })
                                        }
                                        this.setState({
                                          tNameTip: ''
                                        })
                                      }}/>
                              <span className="input-mark">{this.state.tNameTip || "必填项，12个字符以内"}</span>
                            </div>

                            <div className="input-group">
                              <label className="input-label">小组简介</label>
                              <textarea className="input-area" 
                                        type="text" 
                                        placeholder="介绍一下你的小组吧！50字以内"
                                        value={this.state.tDes}
                                        onChange={(e) => {
                                          this.setState({
                                            tDes: e.target.value
                                          })}}
                                        onBlur={()=>{
                                          if (this.state.tDes && this.state.tName.length > 50) {
                                            this.setState({
                                              tDesTip: '团队简介超过了50个字符'
                                            })
                                          }
                                          this.setState({
                                            tDesTip: ''
                                          })
                                        }}/>
                              <span className="input-mark">{this.state.tDesTip || "非必填项"}</span>
                            </div>

                            <div className="input-group mini-group">
                              <div>
                                <label className="input-label">小组是否私密</label>
                                <span className="input-mark">私密小组的图文库只有成员能浏览</span>
                              </div>
                              <Switch 
                                isChecked={this.state.tPublic}
                                toggle={() => {
                                  this.setState({
                                    temp: {
                                      public: !this.state.tPublic
                                    }
                                  })
                                }}/>
                            </div> 

                            <div className="input-group">
                              <button className="input-btn radius-btn"
                                      disabled={!this.judgeSubmitForm(1)}>确认</button>
                            </div>
                          </div>
                         
                         <div className="flex-column">
                            <div className="input-group">
                              <label className="input-label">小组头像</label>
                              <div className="two-side">
                                <img src={require('../../../assets/images/default_g.jpg')} 
                                     className="input-img"
                                     alt=""/>
                                <div className="input-file-box">
                                  <input className="file-input" 
                                         type="file"
                                         accept="image/jpeg,image/x-png"
                                         onChange={this.judgeTempAvatar.bind(this)}
                                         />
                                  <button className="input-btn file-btn radius-btn"><FontAwesomeIcon icon="upload"/>上传头像</button>
                                </div>
                              </div>
                              <span className="input-mark">{this.state.tAvatarTip || "非必填项"}</span>
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